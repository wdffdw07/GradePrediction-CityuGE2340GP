# GE2340 数据分析与基线实验资料包

[English](../README.md) | **简体中文** | [繁體中文（香港）](README.zh-HK.md)

> **[打开在线演示](https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/)** — 在浏览器中体验线性回归和 Jeffrey 的成绩分类器，无需安装。

本资料包包含组员共用的数据、已完成的基线实验，以及撰写小组报告所需的材料。共享数据包为 v3，当前英文分析报告为 v7。文档更新日期：2026 年 11 月 13 日。

## 阅读顺序

| 任务 | 先阅读 | 然后使用 |
|---|---|---|
| 继续模型实验 | [技术交接说明](../docs/HANDOFF.md) | `outputs/processed/`、`config/grade_bands.json`、`src/load_data.py` |
| 撰写报告 | [英文分析报告 v7](../GE2340_Data_Analysis_EN_v7.md) | [技术结果说明](../docs/FINDINGS.md)、结果 CSV 和原始图表 |
| 整理比较结果及制作幻灯片 | [英文分析报告 v7](../GE2340_Data_Analysis_EN_v7.md) | [图表对应说明](../docs/FINDINGS.md#figure-guide)及 `outputs/figures/` |

编辑和小组写作请使用 Markdown 报告。[英文 PDF v7](../GE2340_Data_Analysis_EN_v7.pdf) 是根据当前 v7 Markdown 生成的阅读版；修改报告后应重新生成 PDF。小组主要文档使用英文。[reference_zh/](./) 中的中文报告仍为 v5，供项目负责人个人参考。

## 当前进度

已完成的内容包括数据质量检查、固定数据划分、仅在训练集上拟合的标准化处理、训练集探索性数据分析（EDA）、普通最小二乘法（OLS）回归、训练集均值基线、相对成绩分档标签，以及训练集多数类分类基线。

Jeffrey 的 SGD 分类器已实现并整合到应用中。小型神经网络属于选做扩展。输入、预测目标、比较规则和交付材料见[技术交接说明](../docs/HANDOFF.md)。

继续使用现有的训练集／验证集／测试集划分，样本数分别为 1,200／400／400，并沿用已有预处理参数。通过 `row_id` 对齐记录。分类器预测项目定义的相对成绩分档；选做的神经网络预测连续数值 `Grades`。

## 资料包内容

下表中的路径均相对于项目根目录。

| 位置 | 内容 |
|---|---|
| [可编辑英文报告](../GE2340_Data_Analysis_EN_v7.md) | 当前 v7 Markdown 源文档，供小组写作使用 |
| [英文 PDF v7](../GE2340_Data_Analysis_EN_v7.pdf) | 根据当前 Markdown 报告生成的阅读版 |
| [docs/HANDOFF.md](../docs/HANDOFF.md) | 输入、固定实验设置和交接文件 |
| [docs/FINDINGS.md](../docs/FINDINGS.md) | 已有结果、解释和图表对应关系 |
| [docs/PHASE1_VERIFICATION.md](../docs/PHASE1_VERIFICATION.md) | 已提交 Phase 1 方法的历史核对记录 |
| `data/raw/` | 原始 CSV、压缩包及来源元数据 |
| `config/` | 固定的成绩分档定义 |
| `src/` | 实验流程和数据加载接口 |
| [analysis.ipynb](../analysis.ipynb) | 运行实验流程的 Notebook 入口 |
| `outputs/processed/` | 各数据划分的原始值、标准化值、标签及预处理参数 |
| `outputs/figures/` | 八幅图，每幅均提供 PNG 和 PDF 格式 |
| `outputs/` | 评估指标、预测结果、模型参数、质量检查及已有运行记录 |
| `tests/` | 实验流程检查 |
| [requirements.txt](../requirements.txt) | Python 依赖版本 |
| [DATA_LICENSE.md](../DATA_LICENSE.md) | 数据集署名和许可协议链接 |
| [MANIFEST_SHA256.json](../MANIFEST_SHA256.json) | 项目源码及随包数据的文件校验值；不含清单自身、已安装依赖和桌面应用测试输出 |
| `reference_zh/` | 供项目负责人参考的中文报告、交接说明和文件索引 |

报告第 5 节提到的 v2 分类输出，表示这些结果最初加入资料包的版本；当前 v3 包已包含这些输出。指标 CSV 保留完整精度，报告中的数值经过四舍五入。

## 运行现有实验流程

使用 Python 3.12，在项目根目录执行：

```bash
python -m pip install -r requirements.txt
python src/run_pipeline.py
python -m unittest discover -s tests -v
```

实验流程读取随包提供的原始数据，并将结果写入 `outputs/`。Notebook 调用同一流程。查看已有结果时，可直接打开 CSV、PDF 和 PNG。原始执行记录见 `outputs/environment.json`、`outputs/test_log.txt` 和 `outputs/reproduction_check.txt`。

使用数据或图表时，请保留数据集署名和 [DATA_LICENSE.md](../DATA_LICENSE.md)。原始数据的采集方法，以及记录是真实数据还是合成数据，尚未得到验证；本实验描述的是在该数据集及固定划分下的预测表现。

## 附录：演示应用与网页

浏览器演示和 Windows 桌面应用均包含线性回归及 Jeffrey 的成绩分类器，支持模型切换和离线预测。本节介绍展示使用及应用开发。

应用源码统一放在 `app/`，可直接运行的 Windows 程序放在项目根目录。该程序使用 Git LFS 存储；克隆仓库后，请安装 Git LFS 并运行 `git lfs pull` 下载程序。

```text
ge2340_data_package_v3/
├── GE2340-Model-Explorer-1.1.0-Windows.exe
├── app/
│   ├── README.md
│   ├── demo/       # 共用界面、模型适配器和内嵌模型数据
│   └── desktop/    # Electron 窗口、应用图标和打包配置
├── docs/           # 小组交接说明和技术结果说明
├── outputs/        # 已有实验结果和共享数据导出文件
└── reference_zh/   # 项目负责人的中文参考资料
```

**浏览器访问（macOS、Windows 和 Linux）：**[打开在线演示](https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/)，或从 [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0) 下载[离线网页 ZIP](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Offline-Web.zip)。完整解压后，用浏览器打开 `index.html`，并将解压出的文件保存在一起。两个模型均在浏览器本地运行；离线包进行预测时无需安装软件、启动服务器或连接互联网。

**Windows 桌面应用：**从 [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0) 下载 [Windows 可执行程序](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Windows.exe)，双击即可运行。程序内置运行环境和模型，可离线使用。也可直接在浏览器中打开 [app/demo/index.html](../app/demo/index.html)。原根目录下的 `demo/` 已迁移至 `app/demo/`。

**修改界面或分类器：**编辑 `app/demo/`。应用默认使用 Jeffrey 的分类器，显示相对分组和各组概率。也可切换到线性回归，查看训练集内的估计位置。参数导出与核对方法见[分类器整合指南](../app/demo/README.md#jeffreys-grade-classifier)。

**修改窗口控制或打包：**使用 `app/desktop/`。从项目根目录执行：

```powershell
cd app/desktop
npm ci
npm start
```

首次获取源码后，用 `npm ci` 安装开发依赖。在 `app/desktop/` 中运行 `npm run test:desktop` 可检查窗口和预测流程；运行 `npm run dist` 可在项目根目录生成 Windows 程序。源码修改会在开发模式下生效；要将修改纳入免安装 EXE，需要重新打包。

更新模型输出后，在重新打包前，从项目根目录执行：

```powershell
python app/demo/export_model.py
python app/demo/export_classifier.py
node app/demo/test-models.cjs
node app/demo/test-classifier.cjs
```

`main` 分支中的相关应用文件变更后，在线演示会自动发布。运行 `python app/build_web.py` 可重新生成离线 ZIP 和 Pages 网页文件；输出位于 Git 忽略的 `app/dist/` 目录。

应用概览见 [app/README.md](../app/README.md)，打包详情见 [app/desktop/README.md](../app/desktop/README.md)。
