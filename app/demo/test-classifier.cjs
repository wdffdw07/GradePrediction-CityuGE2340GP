'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('./classifier-data.js');
const api = require('./model-registry.js');
require('./classifier-adapter.js');
const root = path.resolve(__dirname, '../..');
const original = JSON.parse(fs.readFileSync(path.join(root, 'outputs/sgd_classifier_model.json'), 'utf8'));
assert.deepEqual(GE2340_CLASSIFIER, original);
function csv(file) {
  const [header, ...lines] = fs.readFileSync(path.join(root, file), 'utf8').trim().split(/\r?\n/);
  const keys = header.split(',');
  return lines.map(line => Object.fromEntries(line.split(',').map((v, i) => [keys[i], v])));
}
(async () => {
  const expected = new Map(csv('outputs/sgd_predictions.csv').map(r => [r.row_id, r]));
  const labels = new Map(csv('outputs/processed/grade_labels.csv').map(r => [r.row_id, r.grade_class]));
  let count = 0, maxError = 0;
  for (const split of ['train', 'validation', 'test']) {
    const order = ['F', 'D', 'C', 'B', 'A'];
    const matrix = Array.from({length: 5}, () => Array(5).fill(0));
    for (const row of csv(`outputs/processed/${split}_raw.csv`)) {
      const input = Object.fromEntries(api.fields.map(f => [f.key, Number(row[f.key])]));
      const actual = await api.predict('sgd-classifier', input);
      const reference = expected.get(row.row_id);
      assert.equal(reference.split, split);
      assert.equal(actual.label, reference.prediction, `${split}/${row.row_id}: class mismatch`);
      actual.probabilities.forEach((p, i) => {
        const error = Math.abs(p - Number(reference['probability_'+GE2340_CLASSIFIER.classes[i]]));
        maxError = Math.max(maxError, error);
        assert.ok(error < 1e-11, `${split}/${row.row_id}: probability error ${error}`);
      });
      matrix[order.indexOf(labels.get(row.row_id))][order.indexOf(actual.label)]++;
      count++;
    }
    const referenceMatrix = csv(`outputs/sgd_confusion_${split}.csv`).map(r => order.map(label => Number(r[label])));
    assert.deepEqual(matrix, referenceMatrix, split+' committed confusion matrix');
  }
  const probes = JSON.parse(fs.readFileSync(path.join(root, 'outputs/sgd_inference_probes.json'), 'utf8'));
  for (let n = 0; n < probes.inputs.length; n++) {
    const input = Object.fromEntries(api.fields.map((f,i) => [f.key, probes.inputs[n][i]]));
    const result = await api.predict('sgd-classifier', input);
    assert.equal(result.label, probes.labels[n], `probe ${n}`);
    result.probabilities.forEach((p,i) => assert.ok(Math.abs(p-probes.probabilities[n][i]) < 1e-11));
  }
  const input = Object.fromEntries(api.fields.map((f,i) => [f.key,[8,2,8,3,3][i]]));
  for (const value of [NaN,Infinity,-1,25,'8']) await assert.rejects(api.predict('sgd-classifier',{...input,Study_Hours_Per_Day:value}));
  await assert.rejects(api.predict('sgd-classifier',{...input,Study_Hours_Per_Day:7}));
  api.register({id:'bad-label',label:'Bad label fixture',task:'classification',classLabels:['A','B'],predict(){return {label:'A',probabilities:[.1,.9]};}});
  await assert.rejects(api.predict('bad-label',input),/inconsistent label/);
  api.register({id:'tie-label',label:'Tie fixture',task:'classification',classLabels:['A','B'],predict(){return {label:'B',probabilities:[.5,.5]};}});
  assert.equal((await api.predict('tie-label',input)).label,'B');
  console.log(`PASS: ${count} classifier labels/probabilities match Python; max error ${maxError}.`);
  console.log(`PASS: all committed confusion matrices, ${probes.inputs.length} extreme/random schedules, validation and label ties.`);
  console.log('Default schedule:',JSON.stringify(await api.predict('sgd-classifier',input)));
})().catch(error => {console.error(error); process.exitCode=1;});
