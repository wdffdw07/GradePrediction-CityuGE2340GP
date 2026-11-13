(function () {
  'use strict';
  const data = GE2340_CLASSIFIER;
  function sigmoid(value) {
    if (value >= 0) return 1 / (1 + Math.exp(-value));
    const exp = Math.exp(value);
    return exp / (1 + exp);
  }
  GE2340.register({
    id: 'sgd-classifier',
    label: 'Grade classifier · Jeffrey',
    task: 'classification',
    description: 'Five activity inputs · relative grade groups',
    classLabels: data.classes,
    metrics: [
      { label: 'Test accuracy', value: (100 * data.metrics.test.accuracy).toFixed(2) + '%', note: 'Correct relative group' },
      { label: 'Test Macro-F1', value: data.metrics.test.macro_f1.toFixed(4), note: 'Equal weight per class' },
      { label: 'Balanced accuracy', value: (100 * data.metrics.test.balanced_accuracy).toFixed(2) + '%', note: 'Mean class recall' }
    ],
    predict(input) {
      const raw = data.features.map(key => input[key]);
      const expanded = data.powers.map((powers, i) => {
        const value = powers.reduce((product, power, j) => product * Math.pow(raw[j], power), 1);
        return (value - data.mean[i]) / data.scale[i];
      });
      const scores = data.coefficients.map((weights, i) => weights.reduce((sum, weight, j) => sum + weight * expanded[j], data.intercepts[i]));
      const probabilities = scores.map(sigmoid);
      const sum = probabilities.reduce((a, b) => a + b, 0);
      // Preserve sklearn's decision-function argmax, including saturated probability ties.
      const label = data.classes[scores.indexOf(Math.max(...scores))];
      if (sum > 0) return { label, probabilities: probabilities.map(p => p / sum) };
      const max = Math.max(...scores);
      const stable = scores.map(score => Math.exp(score - max));
      const total = stable.reduce((a, b) => a + b, 0);
      return { label, probabilities: stable.map(p => p / total) };
    }
  });
})();
