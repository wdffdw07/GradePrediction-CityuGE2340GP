# GE2340 數據分析與基線實驗資料包

[English](../README.md) | [简体中文](README.zh-CN.md) | **繁體中文（香港）**

本資料包包含組員共用的數據、已完成的基線實驗，以及撰寫小組報告所需的材料。共用數據包為 v3，目前的英文分析報告為 v7。文件更新日期：2026 年 11 月 13 日。

## 閱讀次序

| 工作 | 先閱讀 | 然後使用 |
|---|---|---|
| 繼續模型實驗 | [技術交接說明](../docs/HANDOFF.md) | `outputs/processed/`、`config/grade_bands.json`、`src/load_data.py` |
| 撰寫報告 | [英文分析報告 v7](../GE2340_Data_Analysis_EN_v7.md) | [技術結果說明](../docs/FINDINGS.md)、結果 CSV 及原始圖表 |
| 整理比較結果及製作簡報 | [英文分析報告 v7](../GE2340_Data_Analysis_EN_v7.md) | [圖表對應說明](../docs/FINDINGS.md#figure-guide)及 `outputs/figures/` |

編輯及小組寫作請使用 Markdown 報告。[英文 PDF v7](../GE2340_Data_Analysis_EN_v7.pdf) 是根據目前 v7 Markdown 產生的閱讀版；修改報告後應重新產生 PDF。小組主要文件使用英文。[reference_zh/](./) 內的中文報告仍為 v5，供項目負責人個人參考。

## 目前進度

已完成的內容包括數據質素檢查、固定數據劃分、僅以訓練集擬合的標準化處理、訓練集探索性數據分析（EDA）、普通最小二乘法（OLS）回歸、訓練集平均值基線、相對成績分組標籤，以及訓練集多數類別分類基線。

Jeffrey 的 SGD 分類器已實作並整合至應用程式。小型神經網絡屬於選做擴展。輸入、預測目標、比較規則及交付材料見[技術交接說明](../docs/HANDOFF.md)。

繼續使用現有的訓練集／驗證集／測試集劃分，樣本數分別為 1,200／400／400，並沿用已有預處理參數。以 `row_id` 對應紀錄。分類器預測項目定義的相對成績組別；選做的神經網絡預測連續數值 `Grades`。

## 資料包內容

下表中的路徑均相對於項目根目錄。

| 位置 | 內容 |
|---|---|
| [可編輯英文報告](../GE2340_Data_Analysis_EN_v7.md) | 目前 v7 Markdown 原始文件，供小組寫作使用 |
| [英文 PDF v7](../GE2340_Data_Analysis_EN_v7.pdf) | 根據目前 Markdown 報告產生的閱讀版 |
| [docs/HANDOFF.md](../docs/HANDOFF.md) | 輸入、固定實驗設定及交接檔案 |
| [docs/FINDINGS.md](../docs/FINDINGS.md) | 已有結果、解釋及圖表對應關係 |
| [docs/PHASE1_VERIFICATION.md](../docs/PHASE1_VERIFICATION.md) | 已提交 Phase 1 方法的歷史核對紀錄 |
| `data/raw/` | 原始 CSV、壓縮檔及來源中繼資料 |
| `config/` | 固定的成績分組定義 |
| `src/` | 實驗流程及數據載入介面 |
| [analysis.ipynb](../analysis.ipynb) | 執行實驗流程的 Notebook 入口 |
| `outputs/processed/` | 各數據劃分的原始值、標準化值、標籤及預處理參數 |
| `outputs/figures/` | 八幅圖，每幅均提供 PNG 及 PDF 格式 |
| `outputs/` | 評估指標、預測結果、模型參數、質素檢查及已有執行紀錄 |
| `tests/` | 實驗流程檢查 |
| [requirements.txt](../requirements.txt) | Python 相依套件版本 |
| [DATA_LICENSE.md](../DATA_LICENSE.md) | 數據集署名及授權條款連結 |
| [MANIFEST_SHA256.json](../MANIFEST_SHA256.json) | 項目原始碼及隨包數據的檔案校驗值；不包括清單本身、已安裝套件及桌面應用程式測試輸出 |
| `reference_zh/` | 供項目負責人參考的中文報告、交接說明及檔案索引 |

報告第 5 節提及的 v2 分類輸出，表示這些結果最初加入資料包的版本；目前 v3 包已包含這些輸出。指標 CSV 保留完整精度，報告中的數值則經過四捨五入。

## 執行現有實驗流程

使用 Python 3.12，在項目根目錄執行：

```bash
python -m pip install -r requirements.txt
python src/run_pipeline.py
python -m unittest discover -s tests -v
```

實驗流程讀取隨包提供的原始數據，並將結果寫入 `outputs/`。Notebook 執行同一流程。查看已有結果時，可直接開啟 CSV、PDF 及 PNG。原始執行紀錄見 `outputs/environment.json`、`outputs/test_log.txt` 及 `outputs/reproduction_check.txt`。

使用數據或圖表時，請保留數據集署名及 [DATA_LICENSE.md](../DATA_LICENSE.md)。原始數據的收集方法，以及紀錄是真實數據還是合成數據，尚未得到驗證；本實驗描述的是在此數據集及固定劃分下的預測表現。

## 附錄：示範應用程式與網頁

瀏覽器示範及 Windows 桌面應用程式均包含線性回歸及 Jeffrey 的成績分類器，支援模型切換及離線預測。本節介紹示範用途及應用程式開發。

應用程式原始碼統一放在 `app/`，可直接執行的 Windows 程式放在項目根目錄。該程式使用 Git LFS 儲存；複製儲存庫後，請安裝 Git LFS 並執行 `git lfs pull` 下載程式。

```text
ge2340_data_package_v3/
├── GE2340-Model-Explorer-1.1.0-Windows.exe
├── app/
│   ├── README.md
│   ├── demo/       # 共用介面、模型配接器及內嵌模型數據
│   └── desktop/    # Electron 視窗、應用程式圖示及封裝設定
├── docs/           # 小組交接說明及技術結果說明
├── outputs/        # 已有實驗結果及共用數據匯出檔案
└── reference_zh/   # 項目負責人的中文參考資料
```

**瀏覽器存取（macOS、Windows 及 Linux）：**[開啟網上示範](https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/)，或從 [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0) 下載[離線網頁 ZIP](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Offline-Web.zip)。完整解壓縮後，以瀏覽器開啟 `index.html`，並將解壓縮後的檔案保存在一起。兩個模型均在瀏覽器本機執行；離線包進行預測時毋須安裝軟件、啟動伺服器或連接互聯網。

**Windows 桌面應用程式：**從 [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0) 下載 [Windows 執行檔](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Windows.exe)，按兩下即可執行。程式內置執行環境及模型，可離線使用。亦可直接在瀏覽器中開啟 [app/demo/index.html](../app/demo/index.html)。原本位於根目錄的 `demo/` 已移至 `app/demo/`。

**修改介面或分類器：**編輯 `app/demo/`。應用程式預設使用 Jeffrey 的分類器，顯示相對組別及各組機率。亦可切換至線性回歸，查看在訓練集內的估計位置。參數匯出及核對方法見[分類器整合指南](../app/demo/README.md#jeffreys-grade-classifier)。

**修改視窗控制或封裝：**使用 `app/desktop/`。從項目根目錄執行：

```powershell
cd app/desktop
npm ci
npm start
```

首次取得原始碼後，以 `npm ci` 安裝開發所需套件。在 `app/desktop/` 中執行 `npm run test:desktop` 可檢查視窗及預測流程；執行 `npm run dist` 可在項目根目錄產生 Windows 程式。原始碼修改會在開發模式下生效；要將修改納入免安裝 EXE，須重新封裝。

更新模型輸出後，在重新封裝前，從項目根目錄執行：

```powershell
python app/demo/export_model.py
python app/demo/export_classifier.py
node app/demo/test-models.cjs
node app/demo/test-classifier.cjs
```

`main` 分支內的相關應用程式檔案變更後，網上示範會自動發佈。執行 `python app/build_web.py` 可重新產生離線 ZIP 及 Pages 網頁檔案；輸出位於 Git 忽略的 `app/dist/` 目錄。

應用程式概覽見 [app/README.md](../app/README.md)，封裝詳情見 [app/desktop/README.md](../app/desktop/README.md)。
