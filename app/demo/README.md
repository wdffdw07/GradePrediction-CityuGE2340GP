# GE2340 Model Explorer

Open [index.html](index.html) in a browser to demonstrate linear regression and Jeffrey's grade classifier. The page runs locally, without installation, a server or an internet connection. Keep the files in this directory together when copying the demo.

For sharing, use the [online demo](https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/) or the [offline web ZIP](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Offline-Web.zip). Extract the ZIP before opening `index.html`. See the [web publishing guide](../README.md#publish-the-web-demo-and-offline-package) for rebuilding and deployment.

A Windows portable build with a custom GE2340 title bar and icon is also available. See the [desktop app guide](../desktop/README.md) for running and rebuilding it.

## Using the demo

1. Enter daily hours for the five activities using the sliders or number fields.
2. Physical activity receives the remaining hours by default. Clear the checkbox to enter all five durations manually.
3. The total must be 24 hours. Empty, negative, non-finite or over-budget inputs block prediction.
4. Choose **Grade classifier · Jeffrey** (the default) or **Linear regression**, then select **Run prediction**. The classifier shows the relative group and probabilities in F/D/C/B/A order. Its percentages are model probabilities, not percentile ranks. For linear regression, the main result shows a relative group name with its letter, such as **Middle group (C)**, and a whole-number top percentage labelled **Estimated position in training set**. Expand **View numeric estimate & baseline** to inspect the continuous prediction and mean baseline. Held-out regression metrics remain below the result.
5. **Reset example** restores the demonstration schedule. After an input change, the previous result is marked until prediction runs again.

The page uses English for team presentations. On small screens, inputs and results stack vertically.

## Linear regression

The fitted intercept, coefficients and mean baseline come from [regression_model.json](../../outputs/regression_model.json). Test metrics come from [metrics.csv](../../outputs/metrics.csv). Training ranges come from [train_descriptive_statistics.csv](../../outputs/train_descriptive_statistics.csv).

Linear regression consumes **raw hours** in the fitted feature order. It uses four coefficients plus an intercept; physical activity is the reference under the 24-hour constraint. The underlying regression estimate stays in its original units, without standardization or clipping. The display maps it to the established relative grade bands. The training-mean value in the numeric details is a comparator, not a confidence interval. The error metrics describe the test set, not an individual prediction.

The initial schedule is a demonstration input, not a student record. Source data attribution and terms are recorded in [DATA_LICENSE.md](../../DATA_LICENSE.md).

## Relative group and top percentage

Display names are Upper group (A), Upper-middle group (B), Middle group (C), Lower-middle group (D) and Lower group (F).

The display uses the exact boundaries from [grade_bands.json](../../config/grade_bands.json): F below 7.10; D from 7.10 to below 7.55; C from 7.55 to below 8.00; B from 8.00 to below 8.45; A from 8.45 upward. A score on a boundary enters the higher band. Mapping uses the full-precision prediction before rounding.

The top percentage compares the prediction with the **observed Grades of the 1,200 training records**, not validation/test records or fitted predictions:

```text
top percentage = 100 × (number above the estimate + 0.5 × number equal to it) / 1,200
```

For example, “Top ≈ 40%” places the estimate around the top 40% of that reference distribution. Values round to the nearest whole percentage point; a value that would round to zero displays as “Top <1%”. The underlying calculation retains its full precision. This is a descriptive position in the training dataset, not a percentile calibrated to another school or a probability of classification correctness. F denotes the lowest relative group, not official failure.

These are presentation mappings of the regression estimate. The existing regression metrics remain unchanged; classification performance for the mapped output has not been evaluated. The grade classifier supplies its own predicted class and probabilities, without inferring a precise percentile from a class label alone.

## Files and extension points

| File | Purpose |
|---|---|
| `index.html` / `styles.css` | Shared page layout and styling |
| `app.js` | Input controls, time validation feedback, model selection and result rendering |
| `model-registry.js` | Shared input validation, adapter registration and output validation |
| `model-data.js` | Exported fitted model, metrics, training ranges, fixed bands and observed training Grades |
| `linear-adapter.js` | Regression adapter |
| `classifier-data.js` / `classifier-adapter.js` | Exported classifier parameters and offline inference |
| `export_classifier.py` | Fit Jeffrey's unchanged configuration, verify committed results and export the classifier |
| `test-classifier.cjs` | Check labels, probabilities and confusion matrices against Python |
| `export_model.py` | Refresh browser data from existing outputs without fitting a model |
| `test-models.cjs` | Compare browser inference with all saved predictions and test the adapter contract |

<a id="adding-jeffreys-softmax-classifier"></a>

## Jeffrey's grade classifier

The app reproduces the pipeline in `src/run_pipeline.py`: raw hours → 20 polynomial features → training-fitted standardization → `SGDClassifier(loss='log_loss')`. The implementation uses one-vs-rest logistic classification. Probability estimates use a sigmoid for each class followed by normalization across classes; this is not a joint Softmax model.

`export_classifier.py` calls the original training function with its existing configuration, then checks all three split metrics and confusion matrices against the committed results before exporting. It writes `outputs/sgd_classifier_model.json`, `outputs/sgd_predictions.csv`, inference probes and `classifier-data.js`. No hyperparameters or split definitions are changed. The actual fitted class order is stored with the parameters; the UI displays groups in F/D/C/B/A order.

The classifier adapter preserves the estimator's decision-score argmax, including probability saturation ties. It returns a class label and normalized probabilities. The registry checks probability validity and label consistency. Test accuracy is 42.75%, Macro-F1 is 0.4284, and balanced accuracy is 44.07%; the majority baseline's test accuracy is 18.75%.

For future adapters, register a unique `id`, `label`, `task: 'classification'`, `classLabels`, and `predict(input)` through `GE2340.register`. Inputs contain the five raw-hour values by their original column names. Apply fitted preprocessing inside the adapter. Return `{ probabilities: [...] }` with one finite probability per class summing to one, optionally including a matching `label`. Load trained data and adapters before `app.js` in `index.html`.

## Refreshing and checking

From the package root:

```bash
python app/demo/export_model.py
python app/demo/export_classifier.py
node app/demo/test-models.cjs
node app/demo/test-classifier.cjs
```

The regression check compares all 2,000 saved predictions with JavaScript inference. The classifier check compares all 2,000 labels and probability vectors, all three confusion matrices, and 70 extreme or randomly generated valid schedules. It also checks invalid inputs, the total-time constraint, unclipped predictions and the classification adapter contract. Synthetic classifier fixtures exist only inside the test process; the demo does not load them.

For an optional local HTTP preview, run from the package root:

```bash
python -m http.server 8765 --bind 127.0.0.1 --directory app/demo
```

Open `http://127.0.0.1:8765`. Stop the preview with Ctrl+C when finished.
