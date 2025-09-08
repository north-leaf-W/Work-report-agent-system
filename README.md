# 智能述职Agent系统

智能述职Agent系统是一个基于Flask的企业级模块化Web应用，专为现代企业述职流程设计。系统采用先进的蓝图架构，集成阿里云DashScope AI服务、语音识别技术和智能文档处理能力，为述职人、评委和BP管理者提供全方位的智能化支持，显著提升述职效率和评估准确性。

## 核心功能模块

### 🎯 述职人入口 (Reporter Module)
**智能文档校对与优化**
- **多格式文档解析**：支持PPT、PDF、Word、Excel等格式
- **智能一致性校对**：AI驱动的内容与评分表匹配分析
- **专业修改建议**：基于评分标准的针对性优化建议
- **实时校对反馈**：即时显示缺失项和改进方向

### 👨‍⚖️ 评委入口 (Evaluator Module)
**AI辅助评分与分析**
- **智能打分建议**：基于述职内容的AI评分参考
- **多维度能力评估**：涵盖工作成果、团队协作、创新能力等
- **量化评分导出**：Excel格式的详细评分表生成
- **综合分析报告**：PDF格式的专业评估报告
- **评分依据展示**：透明化的评分逻辑和建议区间

### 👥 BP管理入口 (BP Manager Module)
**员工发展与团队分析**
- **个人诊断报告**：深度能力分析和发展建议
- **语音转文本**：支持MP3/WAV/M4A音频文件智能转录
- **群体能力分析**：团队整体能力分布和对比
- **成长路径规划**：个性化的能力提升建议
- **标杆员工识别**：优秀实践案例分享和学习

## 🏗️ 技术架构

### 后端技术栈
- **Web框架**：Flask 3.1.2 + 蓝图模块化架构
- **AI服务集成**：阿里云DashScope API (qwen-plus模型)
- **文档处理引擎**：
  - python-pptx 1.0.2 (PPT解析)
  - PyPDF2 3.0.1 (PDF处理)
  - python-docx 1.2.0 (Word文档)
  - openpyxl 3.1.5 (Excel表格)
- **语音处理**：阿里云语音识别服务
- **云存储**：阿里云OSS 2.19.1 (可选)
- **报告生成**：ReportLab 4.4.3 (PDF生成)
- **数据分析**：pandas 2.3.2, numpy 2.3.2
- **安全与工具**：Werkzeug 3.1.3, python-dotenv 1.1.1

### 前端技术栈
- **基础技术**：HTML5, CSS3, JavaScript (ES6+)
- **UI框架**：Bootstrap 5.x 响应式设计
- **数据可视化**：Chart.js (能力雷达图、分析图表)
- **交互增强**：Ajax异步请求, 文件拖拽上传

### 系统架构特点
- **🔧 模块化设计**：三大蓝图模块独立开发和维护
- **⚙️ 配置管理**：环境变量配置，支持开发/生产环境切换
- **📁 文件管理**：统一的上传、解析、存储机制
- **🛡️ 错误处理**：完善的异常捕获和降级策略
- **📊 日志记录**：详细的操作日志和调试信息

## 🚀 安装与运行

### 环境要求
- **Python版本**：3.8+ (推荐 3.9+)
- **操作系统**：Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **内存要求**：最低 4GB RAM (推荐 8GB+)
- **磁盘空间**：至少 2GB 可用空间
- **阿里云账号**：用于语音识别和AI服务

### 快速开始

#### 1. 获取项目
```bash
git clone <repository-url>
cd 智能述职Agent系统
```

#### 2. 环境配置
**创建虚拟环境 (推荐)**
```bash
# Windows
py -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. 安装依赖
```bash
# Windows (推荐使用 py 命令)
py -m pip install -r requirements.txt

# macOS/Linux
pip install -r requirements.txt
```

#### 4. 配置API密钥
本系统采用安全的手动配置方式，无需在代码中硬编码API密钥：

1. **启动应用后配置**：首次访问系统时，会自动提示配置API密钥
2. **导航栏配置**：点击顶部导航栏的"API配置"按钮可随时重新配置
3. **安全存储**：API密钥加密存储在本地配置文件中

**所需API密钥**：
- 阿里云DashScope API密钥（用于AI对话和文档处理）

**可选环境配置**（创建 `.env` 文件）：
```env
# 应用配置
FLASK_ENV=development
FLASK_DEBUG=True
UPLOAD_FOLDER=uploads

# 可选：如果使用阿里云OSS存储
OSS_ACCESS_KEY_ID=your_oss_access_key
OSS_ACCESS_KEY_SECRET=your_oss_secret_key
OSS_BUCKET_NAME=your_bucket_name
OSS_ENDPOINT=your_oss_endpoint
```

#### 5. 启动应用
```bash
# 开发模式启动
py app.py

# 或使用 Flask 命令
flask run --host=0.0.0.0 --port=5000
```

#### 6. 访问系统
🌐 **本地访问**：http://localhost:5000  
🌐 **网络访问**：http://your-ip:5000

## 📁 项目结构

```
智能述职Agent系统/
├── 📄 app.py                    # 🚀 Flask应用主入口
├── 📄 app_backup.py             # 📦 原始单体版本备份
├── 📄 app_new.py                # 📄 应用副本文件
├── 📄 requirements.txt          # 📋 Python依赖包清单
├── 📄 .env                      # 🔐 环境变量配置文件
├── 📄 README.md                 # 📖 项目说明文档
├── 📁 uploads/                  # 📂 用户上传文件存储目录
├── 📁 static/                   # 🎨 前端静态资源
│   ├── 📁 css/                 # 🎨 样式表文件
│   ├── 📁 js/                  # ⚡ JavaScript脚本
│   └── 📁 images/              # 🖼️ 图片和图标资源
├── 📁 templates/                # 🌐 Jinja2 HTML模板
│   ├── 📄 index.html           # 🏠 系统主页
│   ├── 📄 reporter.html        # 👤 述职人功能页面
│   ├── 📄 evaluator.html       # 👨‍⚖️ 评委功能页面
│   └── 📄 bp_manager.html      # 👥 BP管理功能页面
└── 📁 modules/                  # 🧩 核心业务模块
    ├── 📄 __init__.py          # 📦 模块初始化文件
    ├── 📄 config.py            # ⚙️ 全局配置管理
    ├── 📄 reporter.py          # 👤 述职人业务逻辑
    ├── 📄 evaluator.py         # 👨‍⚖️ 评委业务逻辑
    ├── 📄 bp_manager.py        # 👥 BP管理业务逻辑
    └── 📄 utils.py             # 🛠️ 通用工具函数库
```

### 核心文件说明
- **app.py**: 模块化Flask应用入口，集成三大蓝图模块
- **modules/**: 业务逻辑模块化封装，便于维护和扩展
- **config.py**: 统一的配置管理，支持环境变量和默认值
- **utils.py**: 文档解析、AI调用等通用功能封装

## 📖 使用指南

### 🎯 述职人入口操作流程

#### 智能文档校对
1. **进入系统**: 访问主页，点击"述职人入口"
2. **上传文件**: 
   - 📄 述职PPT/PDF/Word文档
   - 📊 对应的评分表(Excel格式)
3. **执行校对**: 点击"开始校对"按钮
4. **查看结果**: 
   - ✅ 一致性检查结果
   - 💡 针对性修改建议
   - 📋 缺失内容提醒

### 👨‍⚖️ 评委入口操作流程

#### AI辅助评分
1. **文档上传**: 上传述职相关文档(支持多格式)
2. **智能分析**: 点击"生成打分建议"
3. **评分参考**: 
   - 🎯 各维度评分建议
   - 📊 能力雷达图展示
   - 📝 评分依据说明
4. **结果导出**: 
   - 📄 Excel评分表下载
   - 📋 PDF综合报告生成

### 👥 BP管理入口操作流程

#### 员工发展分析
1. **资料上传**: 
   - 📄 述职文档(PPT/PDF/Word)
   - 🎵 述职录音(MP3/WAV/M4A)
2. **功能选择**: 
   - **个人诊断**: 深度能力分析和发展建议
   - **群体分析**: 团队整体能力分布对比
3. **报告生成**: 
   - 📊 个性化诊断报告
   - 📈 团队能力分析图表
   - 🎯 成长路径规划建议
4. **结果应用**: 
   - 💼 人才发展决策支持
   - 🏆 标杆员工识别
   - 📚 最佳实践分享

### 录音转文本功能
- 支持格式：MP3, WAV, M4A
- 文件大小限制：建议不超过100MB
- 自动上传到云端并进行语音识别
- 转换结果会在控制台显示详细日志

## 注意事项

### 文件格式支持
- **文档类型**：PPT (.pptx), Word (.doc, .docx), Excel (.xlsx, .xls), PDF (.pdf)
- **音频类型**：MP3 (.mp3), WAV (.wav), M4A (.m4a)
- **文件大小**：建议单个文件不超过100MB

### 配置要求
- **必需**：配置有效的DashScope API密钥
- **可选**：配置阿里云OSS存储（用于音频文件存储）
- 确保评分表格式符合系统要求
- 网络环境需要能够访问阿里云服务

### 开发调试
- 应用运行在调试模式，代码修改会自动重载
- 控制台会显示详细的处理日志
- 音频转文本功能的处理状态会实时显示

## 🔧 配置说明

### API密钥配置
系统支持两种API密钥配置方式：

1. **首页配置**（推荐）：
   - 访问系统首页，在"API配置"卡片中输入DashScope API密钥
   - 系统会自动验证密钥有效性并本地保存
   - 配置成功后所有功能模块将自动使用该密钥

2. **环境变量配置**：
   - 在`.env`文件中设置`DASHSCOPE_API_KEY=your_api_key_here`
   - 系统启动时会自动加载环境变量中的密钥

## 🔧 故障排除

### ❗ 常见问题及解决方案

#### 1. 🐍 Python环境问题
**问题**: `pip` 或 `python` 命令无法识别
```bash
# 解决方案 (Windows)
py -m pip install -r requirements.txt

# 或添加Python到系统PATH
# 控制面板 → 系统 → 高级系统设置 → 环境变量
```

#### 2. 📦 依赖安装失败
**问题**: 包安装超时或失败
```bash
# 使用国内镜像源
py -m pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 或升级pip
py -m pip install --upgrade pip
```

#### 3. 🔑 API密钥问题
**问题**: DashScope API调用失败
- ✅ 检查 `.env` 文件中的 `DASHSCOPE_API_KEY` 是否正确
- ✅ 确认阿里云账户余额充足
- ✅ 验证API密钥权限和有效期

#### 4. 📁 文件上传问题
**问题**: 文件上传失败或解析错误
- ✅ **支持格式**: PPT/PPTX, PDF, DOC/DOCX, XLS/XLSX
- ✅ **音频格式**: MP3, WAV, M4A
- ✅ **文件大小**: 建议不超过50MB
- ✅ **权限检查**: 确保 `uploads/` 目录可写

#### 5. 🎵 音频转文本失败
**问题**: 语音识别服务异常
```python
# 检查音频文件
- 时长: 建议不超过5分钟
- 质量: 清晰度影响识别准确率
- 格式: MP3/WAV/M4A (推荐WAV)
```

#### 6. 🌐 网络连接问题
**问题**: 无法访问外部API服务
- ✅ 检查防火墙和代理设置
- ✅ 确认网络连接稳定
- ✅ 验证DNS解析正常

### 📊 调试模式
```bash
# 启用详细日志
export FLASK_ENV=development
export FLASK_DEBUG=True
py app.py
```

### 📋 日志分析
- **控制台输出**: 实时查看请求和错误信息
- **错误追踪**: 详细的堆栈跟踪帮助定位问题
- **性能监控**: 关注API响应时间和资源使用

---

**🚀 智能述职Agent系统 - 让述职更智能，让评估更精准！**
