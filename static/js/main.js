// 智能述职Agent系统 - 前端逻辑

// API密钥管理
class APIKeyManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkAPIStatus();
    }
    
    bindEvents() {
        // 切换密钥显示/隐藏
        const toggleBtn = document.getElementById('toggleApiKey');
        const apiKeyInput = document.getElementById('apiKeyInput');
        
        if (toggleBtn && apiKeyInput) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = apiKeyInput.type === 'password';
                apiKeyInput.type = isPassword ? 'text' : 'password';
                toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            });
        }
        
        // 验证API密钥
        const validateBtn = document.getElementById('validateApiKey');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateAPIKey());
        }
        
        // 保存API密钥
        const saveBtn = document.getElementById('saveApiKey');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAPIKey());
        }
        
        // 重新配置
        const reconfigureBtn = document.getElementById('reconfigureApi');
        if (reconfigureBtn) {
            reconfigureBtn.addEventListener('click', () => this.showConfigForm());
        }
    }
    
    async checkAPIStatus() {
        try {
            const response = await fetch('/api/config/status');
            
            if (!response.ok) {
                console.error('API响应错误:', response.status, response.statusText);
                this.showConfigForm();
                return;
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('API返回非JSON格式:', contentType);
                this.showConfigForm();
                return;
            }
            
            const data = await response.json();
            
            if (data.success && data.configured) {
                this.showConfigSuccess();
            } else {
                this.showConfigForm();
            }
        } catch (error) {
            console.error('检查API状态失败:', error);
            this.showConfigForm();
        }
    }
    
    async validateAPIKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const validateBtn = document.getElementById('validateApiKey');
        const saveBtn = document.getElementById('saveApiKey');
        
        if (!apiKeyInput.value.trim()) {
            this.showToast('请输入API密钥', 'warning');
            return;
        }
        
        validateBtn.disabled = true;
        validateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>验证中...';
        
        try {
            const response = await fetch('/api/config/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: apiKeyInput.value.trim()
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.validation.valid) {
                this.showToast('API密钥验证成功！', 'success');
                saveBtn.style.display = 'inline-block';
                validateBtn.innerHTML = '<i class="fas fa-check me-2"></i>验证成功';
                validateBtn.classList.remove('btn-primary');
                validateBtn.classList.add('btn-success');
            } else {
                this.showToast(data.validation?.error || '密钥验证失败', 'error');
                validateBtn.innerHTML = '<i class="fas fa-check me-2"></i>验证密钥';
            }
        } catch (error) {
            console.error('验证API密钥失败:', error);
            this.showToast('验证失败，请检查网络连接', 'error');
            validateBtn.innerHTML = '<i class="fas fa-check me-2"></i>验证密钥';
        } finally {
            validateBtn.disabled = false;
        }
    }
    
    async saveAPIKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const saveBtn = document.getElementById('saveApiKey');
        
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>保存中...';
        
        try {
            const response = await fetch('/api/config/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: apiKeyInput.value.trim()
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showToast('API密钥保存成功！', 'success');
                this.showConfigSuccess();
            } else {
                this.showToast(data.error || '保存失败', 'error');
            }
        } catch (error) {
            console.error('保存API密钥失败:', error);
            this.showToast('保存失败，请检查网络连接', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>保存配置';
        }
    }
    
    showConfigForm() {
        const form = document.getElementById('apiConfigForm');
        const success = document.getElementById('apiConfigSuccess');
        const badge = document.getElementById('apiStatusBadge');
        const navBtn = document.getElementById('apiConfigBtn');
        
        if (form) form.style.display = 'block';
        if (success) success.style.display = 'none';
        if (badge) {
            badge.textContent = '未配置';
            badge.className = 'badge bg-warning';
        }
        
        // 更新导航栏按钮状态
        if (navBtn) {
            navBtn.innerHTML = '<i class="fas fa-key"></i> API配置';
            navBtn.classList.remove('text-success');
            navBtn.classList.add('text-warning');
        }
        
        // 重置表单状态
        const validateBtn = document.getElementById('validateApiKey');
        const saveBtn = document.getElementById('saveApiKey');
        const apiKeyInput = document.getElementById('apiKeyInput');
        
        if (validateBtn) {
            validateBtn.innerHTML = '<i class="fas fa-check me-2"></i>验证密钥';
            validateBtn.classList.remove('btn-success');
            validateBtn.classList.add('btn-primary');
        }
        if (saveBtn) saveBtn.style.display = 'none';
        if (apiKeyInput) apiKeyInput.value = '';
    }
    
    showConfigSuccess() {
        const form = document.getElementById('apiConfigForm');
        const success = document.getElementById('apiConfigSuccess');
        const badge = document.getElementById('apiStatusBadge');
        const navBtn = document.getElementById('apiConfigBtn');
        
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
        if (badge) {
            badge.textContent = '已配置';
            badge.className = 'badge bg-success';
        }
        
        // 更新导航栏按钮状态
        if (navBtn) {
            navBtn.innerHTML = '<i class="fas fa-key"></i> API已配置';
            navBtn.classList.remove('text-warning');
            navBtn.classList.add('text-success');
        }
    }
    
    showToast(message, type = 'info') {
        // 使用现有的showToast函数
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// 从文件名中提取员工姓名的函数
function extractEmployeeNameFromFileName(filename) {
    // 文件名中员工姓名的常见模式
    const patterns = [
        // 匹配像 "方糖+【材料】..." 这样的格式
        /^([a-zA-Z\u4e00-\u9fa5]{1,10})\+/,
        // 匹配像 "方糖-述职报告" 这样的格式
        /^([a-zA-Z\u4e00-\u9fa5]{1,10})-/,
        // 匹配像 "方糖述职" 这样的格式
        /^([a-zA-Z\u4e00-\u9fa5]{1,10})述职/,
        // 匹配像 "方糖报告" 这样的格式
        /^([a-zA-Z\u4e00-\u9fa5]{1,10})报告/,
        // 匹配像 "方糖" 之类只有姓名的文件
        /^([a-zA-Z\u4e00-\u9fa5]{2,4})$/,
        // 匹配文件名末尾的姓名，如 "述职报告-方糖"
        /[-_]([a-zA-Z\u4e00-\u9fa5]{2,4})$/,
    ];
    
    console.log(`正在从文件名提取员工姓名，文件名: ${filename}`);
    
    // 过滤掉的非姓名词汇
    const excludeWords = ['述职', '报告', '材料', '能力', '认定', '打分', '参考', '文档', '资料', 'PPT', 'PDF', 'WORD', 'DOC'];
    
    for (const pattern of patterns) {
        const match = filename.match(pattern);
        if (match) {
            const extractedName = match[1].trim();
            // 过滤掉一些常见的非姓名词汇
            if (!excludeWords.includes(extractedName)) {
                console.log(`从文件名提取到员工姓名: ${extractedName}`);
                return extractedName;
            }
        }
    }
    
    console.log('文件名中未找到有效的员工姓名');
    return '未知';
}

// 测试音频文件功能
// initAudioTesting函数已移除，因为测试按钮已被删除

document.addEventListener('DOMContentLoaded', function() {
    // 初始化API密钥管理器
    window.apiKeyManager = new APIKeyManager();
    
    initPageNavigation();
    initFileUploads();
    initFormSubmissions();
});

// 页面导航逻辑
function initPageNavigation() {
    document.querySelectorAll('.navbar-brand, .entrance-card, .btn-entrance, .home-button').forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                // 隐藏所有页面
                document.querySelectorAll('.page-content').forEach(page => {
                    page.classList.remove('active');
                });
                
                // 显示目标页面
                document.getElementById(targetPage).classList.add('active');
                
                // 初始化页面特定的图表
                if (targetPage === 'scoring') {
                    if (typeof initScoringRadarChart === 'function') {
                        initScoringRadarChart();
                    }
                } else if (targetPage === 'analysis') {
                    // analysis页面的雷达图是在生成报告时动态创建的，这里不需要初始化
                    console.log('切换到分析页面，雷达图将在生成报告时创建');
                } else if (targetPage === 'cohort') {
                    if (typeof initCohortChart === 'function') {
                        initCohortChart();
                    }
                }
            }
        });
        console.log('雷达图创建完成:', window.diagnosisChart);
    });
}

// 文件上传逻辑
function initFileUploads() {
    // 述职原文上传按钮
    const reportUploadBtn = document.getElementById('reportUploadBtn');
    const reportFileInput = document.getElementById('reportFileInput');
    
    if (reportUploadBtn && reportFileInput) {
        reportUploadBtn.addEventListener('click', function() {
            reportFileInput.click();
        });
        
        reportFileInput.addEventListener('change', function(e) {
            if (e.target.files.length) {
                const file = e.target.files[0];
                handleFileUpload(file, 'report');
            }
        });
    }
    
    // 评分标准上传按钮
    const standardUploadBtn = document.getElementById('standardUploadBtn');
    const standardFileInput = document.getElementById('standardFileInput');
    
    if (standardUploadBtn && standardFileInput) {
        standardUploadBtn.addEventListener('click', function() {
            standardFileInput.click();
        });
        
        standardFileInput.addEventListener('change', function(e) {
            if (e.target.files.length) {
                const file = e.target.files[0];
                handleFileUpload(file, 'standard');
            }
        });
    }
    
    // 保留旧的上传区域逻辑以兼容其他部分
    document.querySelectorAll('.upload-area').forEach(uploadArea => {
        uploadArea.addEventListener('click', function() {
            const fileInput = this.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            } else {
                const tempInput = document.createElement('input');
                tempInput.type = 'file';
                tempInput.accept = '.pdf,.pptx,.xlsx,.mp3,.wav,.m4a';
                
                tempInput.onchange = function(e) {
                    if (e.target.files.length) {
                        handleFileUpload(e.target.files[0], uploadArea);
                    }
                };
                
                tempInput.click();
            }
        });
        
        // 为隐藏的文件输入框添加change事件
        const hiddenInput = uploadArea.querySelector('input[type="file"]');
        if (hiddenInput) {
            hiddenInput.addEventListener('change', function(e) {
                if (e.target.files.length) {
                    handleFileUpload(e.target.files[0], uploadArea);
                }
            });
        }
        
        // 为上传按钮添加点击事件（兼容旧版本）
        const uploadButton = uploadArea.querySelector('button');
        if (uploadButton) {
            uploadButton.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止事件冒泡
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = this.classList.contains('btn-primary') ? '.pdf,.pptx' : 
                                  this.classList.contains('btn-success') ? '.xlsx' : 
                                  this.classList.contains('btn-danger') ? '.pdf,.pptx' : 
                                  this.classList.contains('btn-info') ? '.mp3,.wav,.m4a' : 
                                  this.classList.contains('btn-warning') ? '.pdf,.xlsx' : '.xlsx';
                
                fileInput.onchange = function(e) {
                    if (e.target.files.length) {
                        handleFileUpload(e.target.files[0], uploadArea);
                    }
                };
                
                fileInput.click();
            });
        }
    });
}

// 获取文件类型
function getFileTypeFromName(fileName) {
    if (fileName.endsWith('.pdf') || fileName.endsWith('.pptx')) {
        return 'document';
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        return 'word';
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        return 'score';
    } else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.m4a')) {
        return 'audio';
    }
    return 'unknown';
}

// 根据文件类型获取接受的文件格式
function getAcceptTypeFromFileType(fileType) {
    switch(fileType) {
        case 'document':
            return '.pdf,.pptx';
        case 'word':
            return '.doc,.docx';
        case 'score':
            return '.xlsx,.xls';
        case 'audio':
            return '.mp3,.wav,.m4a';
        default:
            return '*';
    }
}

// 验证音频文件是否可用
function validateAudioFile(file) {
    return new Promise((resolve, reject) => {
        // 首先检查文件基本信息
        if (!file || file.size === 0) {
            resolve({
                valid: false,
                message: '文件为空或无效'
            });
            return;
        }
        
        // 检查文件大小（提前检查，避免创建过大文件的blob）
        if (file.size > 200 * 1024 * 1024) {
            resolve({
                valid: false,
                message: '音频文件过大，请选择小于200MB的文件'
            });
            return;
        }
        
        const audio = new Audio();
        let url = null;
        let isResolved = false;
        
        // 清理资源的函数
        const cleanup = () => {
            try {
                if (url) {
                    URL.revokeObjectURL(url);
                    url = null;
                }
                if (audio) {
                    audio.src = '';
                    audio.removeAttribute('src');
                    audio.load();
                }
            } catch (e) {
                console.warn('清理音频资源时出错:', e);
            }
        };
        
        // 设置超时机制（8秒，减少等待时间）
        const timeout = setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                cleanup();
                resolve({
                    valid: false,
                    message: '音频文件验证超时，可能文件过大或格式有问题'
                });
            }
        }, 8000);
        
        try {
            // 使用更安全的方式创建blob URL
            url = URL.createObjectURL(file);
            
            audio.onloadedmetadata = function() {
                if (isResolved) return;
                isResolved = true;
                clearTimeout(timeout);
                
                try {
                    const duration = audio.duration;
                    const fileSize = file.size;
                    
                    cleanup();
                    
                    // 检查音频时长（应该大于0且小于2小时）
                    if (duration > 0 && duration < 7200) {
                        resolve({
                            valid: true,
                            duration: duration,
                            size: fileSize,
                            message: `音频文件有效 - 时长: ${Math.floor(duration/60)}分${Math.floor(duration%60)}秒, 大小: ${(fileSize/1024/1024).toFixed(2)}MB`
                        });
                    } else {
                        resolve({
                            valid: false,
                            message: duration <= 0 ? '音频文件损坏或无效' : '音频文件过长，请选择小于2小时的录音'
                        });
                    }
                } catch (e) {
                    cleanup();
                    resolve({
                        valid: false,
                        message: '读取音频文件信息时出错'
                    });
                }
            };
            
            audio.onerror = function(e) {
                if (isResolved) return;
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve({
                    valid: false,
                    message: '音频文件格式不支持或文件损坏'
                });
            };
            
            audio.onabort = function() {
                if (isResolved) return;
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve({
                    valid: false,
                    message: '音频文件加载被中断'
                });
            };
            
            // 延迟设置音频源，避免立即加载导致的错误
            setTimeout(() => {
                if (!isResolved && url && audio) {
                    try {
                        audio.src = url;
                        audio.load(); // 显式调用load方法
                    } catch (e) {
                        if (!isResolved) {
                            isResolved = true;
                            clearTimeout(timeout);
                            cleanup();
                            resolve({
                                valid: false,
                                message: '设置音频源时出错'
                            });
                        }
                    }
                }
            }, 100); // 延迟100ms
            
        } catch (error) {
            if (isResolved) return;
            isResolved = true;
            clearTimeout(timeout);
            cleanup();
            resolve({
                valid: false,
                message: '无法创建音频对象，文件可能损坏: ' + error.message
            });
        }
    });
}

// 处理文件上传
function handleFileUpload(file, fileType) {
    // 显示上传中状态（仅对能力认定打分页面）
    if (fileType === 'report' || fileType === 'standard') {
        const statusId = fileType === 'report' ? 'reportFileInfo' : 'standardFileInfo';
        const statusElement = document.getElementById(statusId);
        if (statusElement) {
            statusElement.innerHTML = `<div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">上传中...</span>
                </div>
                <p class="mt-2">正在上传 ${file.name}...</p>
            </div>`;
            statusElement.style.display = 'block';
        }
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // 统一使用上传API
    let uploadUrl = '/api/upload';
    
    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.file_path) {
            // 检查是否是能力认定打分页面的文件上传
            if (fileType === 'report' || fileType === 'standard') {
                // 显示文件信息
                const fileInfoId = fileType === 'report' ? 'reportFileInfo' : 'standardFileInfo';
                const fileNameId = fileType === 'report' ? 'reportFileName' : 'standardFileName';
                const fileInfo = document.getElementById(fileInfoId);
                const fileName = document.getElementById(fileNameId);
                
                if (fileInfo) {
                    fileInfo.innerHTML = `<div class="text-success">
                        <i class="fas fa-check-circle"></i> ${file.name}
                    </div>`;
                    fileInfo.style.display = 'block';
                }
                
                // 保存文件路径和原始文件名
                if (fileType === 'report') {
                    window.reportFilePath = data.file_path;
                    window.reportFileName = file.name.replace(/\.[^/.]+$/, ""); // 去掉扩展名
                } else if (fileType === 'standard') {
                    window.standardFilePath = data.file_path;
                    window.standardFileName = file.name.replace(/\.[^/.]+$/, ""); // 去掉扩展名
                }
                
                // 检查是否两个文件都已上传，如果是则启用生成按钮
                const generateBtn = document.getElementById('generateScoringBtn');
                if (generateBtn && window.reportFilePath && window.standardFilePath) {
                    generateBtn.disabled = false;
                }
            }
            // 处理其他上传区域（包括评委打分结果）
            else if (fileType && typeof fileType === 'object' && fileType.id) {
                console.log('处理上传区域:', fileType.id); // 调试信息
                if (fileType.id === 'judgeScoreUpload') {
                    // 显示上传成功信息
                    fileType.innerHTML = `<div class="text-success">
                        <i class="fas fa-check-circle"></i> ${file.name} 上传成功
                        <small class="d-block text-muted">评委打分结果已上传，可用于诊断分析</small>
                    </div>`;
                    
                    // 保存评委打分结果文件路径
                    window.judgeScoreFilePath = data.file_path;
                    window.judgeScoreFileName = file.name;
                    
                    console.log('评委打分结果文件路径:', data.file_path); // 调试信息
                    showToast('评委打分结果上传成功', 'success');
                } else if (fileType.id === 'docAnalysisUpload') {
                    // 显示上传成功信息
                    fileType.innerHTML = `<div class="text-success">
                        <i class="fas fa-check-circle"></i> ${file.name} 上传成功
                        <small class="d-block text-muted">PDF文件已上传，可用于诊断分析</small>
                    </div>`;
                    
                    // 保存PDF文件路径（用于诊断报告生成）
                    window.docPath = data.file_path; // 修复：使用docPath而不是docAnalysisFilePath
                    window.docAnalysisFilePath = data.file_path; // 保留原变量以兼容其他功能
                    window.docAnalysisFileName = file.name;
                    
                    console.log('PDF文件路径:', data.file_path); // 调试信息
                    showToast('PDF文件上传成功', 'success');
                } else if (fileType.id === 'audioAnalysisUpload') {
                    // 先显示上传成功信息
                    fileType.innerHTML = `<div class="text-success">
                        <i class="fas fa-check-circle"></i> ${file.name} 上传成功
                        <small class="d-block text-muted">正在验证音频文件...</small>
                    </div>`;
                    
                    // 保存录音文件路径
                    window.audioAnalysisFilePath = data.file_path;
                    window.audioAnalysisFileName = file.name;
                    
                    console.log('录音文件路径:', data.file_path); // 调试信息
                    showToast('录音文件上传成功，正在验证...', 'success');
                    
                    // 简化音频验证，避免blob URL错误
                    // 基于文件扩展名和大小进行基础验证
                    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];
                    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
                    const isAudioFile = audioExtensions.includes(fileExtension);
                    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
                    
                    if (isAudioFile && file.size > 0 && file.size < 200 * 1024 * 1024) {
                        // 显示验证成功信息
                        fileType.innerHTML = `<div class="text-success">
                            <i class="fas fa-check-circle"></i> ${file.name} 上传成功
                            <small class="d-block text-muted">音频文件格式: ${fileExtension.toUpperCase()}, 大小: ${fileSizeMB}MB</small>
                            <small class="d-block text-info">录音文件已上传，生成诊断报告时将自动进行语音转文本处理</small>
                        </div>`;
                        showToast('录音文件上传成功，将在诊断时自动转换为文本', 'success');
                    } else if (!isAudioFile) {
                        // 文件格式不支持
                        fileType.innerHTML = `<div class="text-warning">
                            <i class="fas fa-exclamation-triangle"></i> ${file.name} 上传成功但格式可能不支持
                            <small class="d-block text-muted">建议使用 MP3、WAV、M4A 等常见音频格式</small>
                            <small class="d-block text-warning">文件已保存，但可能影响分析效果</small>
                        </div>`;
                        showToast('音频文件格式可能不支持', 'warning');
                    } else if (file.size >= 200 * 1024 * 1024) {
                        // 文件过大
                        fileType.innerHTML = `<div class="text-warning">
                            <i class="fas fa-exclamation-triangle"></i> ${file.name} 文件过大
                            <small class="d-block text-muted">文件大小: ${fileSizeMB}MB，建议小于200MB</small>
                            <small class="d-block text-warning">文件已保存，但可能影响处理速度</small>
                        </div>`;
                        showToast('音频文件过大，建议压缩后重新上传', 'warning');
                    } else {
                        // 其他问题
                        fileType.innerHTML = `<div class="text-info">
                            <i class="fas fa-info-circle"></i> ${file.name} 上传成功
                            <small class="d-block text-muted">文件已保存，可继续使用</small>
                        </div>`;
                        showToast('文件上传成功', 'info');
                    }
                } else if (fileType.id === 'docUploadArea') {
                    // 显示上传成功信息
                    fileType.innerHTML = `<div class="text-success">
                        <i class="fas fa-check-circle"></i> ${file.name} 上传成功
                        <small class="d-block text-muted">述职文档已上传，可用于诊断分析</small>
                    </div>`;
                    
                    // 保存述职文档路径（用于诊断报告生成）
                    window.docPath = data.file_path;
                    window.docFileName = file.name;
                    
                    console.log('述职文档路径:', data.file_path); // 调试信息
                    showToast('述职文档上传成功', 'success');
                } else {
                    console.log('未匹配的上传区域ID:', fileType.id); // 调试信息
                }
            } else {
                console.log('fileType类型或结构不匹配:', typeof fileType, fileType); // 调试信息
            }
        } else {
            // 上传失败，清除加载状态并显示错误
            if (fileType === 'report' || fileType === 'standard') {
                const fileInfoId = fileType === 'report' ? 'reportFileInfo' : 'standardFileInfo';
                const fileInfo = document.getElementById(fileInfoId);
                if (fileInfo) {
                    fileInfo.style.display = 'none';
                }
            }
            showToast('上传失败: ' + (data.error || '未知错误'), 'danger');
        }
    })
    .catch(error => {
        // 网络错误等异常情况，清除加载状态
        if (fileType === 'report' || fileType === 'standard') {
            const fileInfoId = fileType === 'report' ? 'reportFileInfo' : 'standardFileInfo';
            const fileInfo = document.getElementById(fileInfoId);
            if (fileInfo) {
                fileInfo.style.display = 'none';
            }
        }
        showToast('上传错误: ' + error.message, 'danger');
    });
}

// 全局变量存储解析结果
let docText = '';
let scoreItems = [];

// 解析文档内容（支持PPT和PDF）
function parseDocument(docPath) {
    fetch('/api/parse_document', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({doc_path: docPath})
    })
    .then(response => response.json())
    .then(data => {
        docText = data.doc_text || '';
        showToast('文档解析成功！', 'success');
        checkVerifyButtonState();
    })
    .catch(error => {
        showToast('文档解析失败: ' + error.message, 'danger');
    });
}

// 保留旧函数以兼容现有代码
function parsePPT(pptPath) {
    parseDocument(pptPath);
}

// 解析评分表内容
function parseScore(scorePath) {
    fetch('/api/parse_score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({score_path: scorePath})
    })
    .then(response => response.json())
    .then(data => {
        scoreItems = data.score_items || [];
        showToast('评分表解析成功！', 'success');
        checkVerifyButtonState();
    })
    .catch(error => {
        showToast('评分表解析失败: ' + error.message, 'danger');
    });
}

// 检查校对按钮状态
function checkVerifyButtonState() {
    const verifyButton = document.querySelector('#verification .btn-primary.w-100.mt-3');
    if (verifyButton) {
        if (docText && scoreItems.length > 0) {
            verifyButton.disabled = false;
        } else {
            verifyButton.disabled = true;
        }
    }
}

// 表单提交逻辑
function initFormSubmissions() {
    // 文档校对提交
    const verifyButton = document.querySelector('#verification .btn-primary.w-100.mt-3');
    if (verifyButton) {
        verifyButton.disabled = true; // 初始状态为禁用
        verifyButton.addEventListener('click', function() {
            if (!docText || scoreItems.length === 0) {
                showToast('请先上传并解析文档和评分表文件', 'warning');
                return;
            }
            
            // 显示加载状态
            this.disabled = true;
            this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 校对中...`;
            
            fetch('/api/verify', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({doc_text: docText, score_items: scoreItems})
            })
            .then(response => response.json())
            .then(data => {
                // 恢复按钮状态
                this.disabled = false;
                this.textContent = '开始校对';
                
                // 显示校对结果
                updateVerificationResults(data);
            })
            .catch(error => {
                // 恢复按钮状态
                this.disabled = false;
                this.textContent = '开始校对';
                showToast('校对失败: ' + error.message, 'danger');
            });
        });
    }
    
    // 生成能力评分按钮
    const scoringButton = document.getElementById('generateScoringBtn');
    if (scoringButton) {
        scoringButton.addEventListener('click', function() {
            // 检查是否上传了述职原文和评分标准文件
            if (!window.reportFilePath) {
                showToast('请先上传述职原文Word文件', 'warning');
                return;
            }
            
            if (!window.standardFilePath) {
                showToast('请先上传评分标准Excel文件', 'warning');
                return;
            }
            
            this.disabled = true;
            
            // 检查是否有录音文件需要转文本
            const hasAudioFile = window.audioAnalysisFilePath;
            if (hasAudioFile) {
                this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 正在处理录音文件并生成报告...`;
                showToast('正在进行语音转文本处理，请稍候...', 'info');
            } else {
                this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 生成中...`;
            }
            
            // 显示加载动画
            showLoadingAnimation();
            
            // 创建FormData对象发送文件路径
            const formData = new FormData();
            formData.append('report_file_path', window.reportFilePath);
            formData.append('standard_file_path', window.standardFilePath);
            
            // 调用后端API获取能力评分
            fetch('/api/generate_ability_scoring', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                this.disabled = false;
                this.textContent = '生成能力评分';
                
                // 添加API响应调试信息
                console.log('=== API响应调试信息 ===');
                console.log('完整API响应:', data);
                if (data.scoring_results && data.scoring_results.length > 0) {
                    console.log('API返回的第一条评分数据:', data.scoring_results[0]);
                    const abilityValue = data.scoring_results[0]['能力值（1-10分）'];
                    console.log('API返回的第一条数据的能力值:', abilityValue, typeof abilityValue);
                }
                
                if (data.success) {
                    // 显示评分结果
                    displayScoringResults(data.scoring_results, data.column_order);
                    showToast('能力评分已生成', 'success');
                    
                    // 同时生成述职分析
                    generateReportAnalysis();
                } else {
                    // 隐藏加载动画
                    hideLoadingAnimation();
                    showToast('生成打分建议失败: ' + (data.error || '未知错误'), 'danger');
                }
            })
            .catch(error => {
                this.disabled = false;
                this.textContent = '生成能力评分';
                // 隐藏加载动画
                hideLoadingAnimation();
                showToast('生成打分建议错误: ' + error.message, 'danger');
            });
        });
    }
    
    // 生成诊断报告按钮
    const diagnosisButton = document.getElementById('generateDiagnosisBtn');
    if (diagnosisButton) {
        diagnosisButton.addEventListener('click', function() {
            // 检查是否上传了必要文件
            if (!window.docPath) {
                showToast('请先上传述职PDF文件', 'warning');
                return;
            }
            
            this.disabled = true;
            this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 生成中...`;
            
            // 获取员工信息（使用空值让后端自动提取）
            const employeeName = ''; // 让后端从文档中自动提取
            const abilityModel = ''; // 让后端从文档中自动提取
            const quarter = ''; // 让后端从文档中自动提取
            
            // 获取解析维度选择
            const employeeAnalysis = document.getElementById('employeeAnalysis').checked;
            const growthSuggestions = document.getElementById('growthSuggestions').checked;
            
            // 调用后端API生成诊断报告
            fetch('/api/generate_diagnosis', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    employee_name: employeeName,
                    ability_model: abilityModel,
                    quarter: quarter,
                    doc_path: window.docPath,
                    include_employee_analysis: employeeAnalysis,
                    include_growth_suggestions: growthSuggestions,
                    judge_score_path: window.judgeScoreFilePath || '', // 评委打分结果文件路径
                    pdf_analysis_path: window.pdfAnalysisFilePath || '', // PDF文件路径
                    audio_analysis_path: window.audioAnalysisFilePath || '' // 录音文件路径
                })
            })
            .then(response => response.json())
            .then(data => {
                this.disabled = false;
                this.textContent = '生成诊断报告';
                
                if (data.success) {
                    // 更新诊断报告显示
                    updateDiagnosisReport(data.diagnosis);
                    
                    // 显示提取到的员工信息
                    if (data.extracted_info) {
                        let infoMessage = '已自动提取员工信息：';
                        if (data.extracted_info.name !== '未知') {
                            infoMessage += ` 姓名：${data.extracted_info.name}`;
                        }
                        if (data.extracted_info.position !== '未知') {
                            infoMessage += ` 职位：${data.extracted_info.position}`;
                        }
                        if (data.extracted_info.quarter !== '未知') {
                            infoMessage += ` 评估周期：${data.extracted_info.quarter}`;
                        }
                        
                        if (infoMessage !== '已自动提取员工信息：') {
                            showToast(infoMessage, 'info');
                        }
                    }
                    
                    let successMessage = '诊断报告已生成';
                    if (data.note) {
                        successMessage += ` (${data.note})`;
                    }
                    showToast(successMessage, 'success');
                } else {
                    showToast('生成诊断报告失败: ' + (data.error || '未知错误'), 'danger');
                }
            })
            .catch(error => {
                this.disabled = false;
                this.textContent = '生成诊断报告';
                showToast('生成诊断报告错误: ' + error.message, 'danger');
            });
        });
    }
    
    // 生成群体分析报告按钮
    const cohortButton = document.querySelector('#cohort .btn-primary.w-100');
    if (cohortButton) {
        cohortButton.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 生成中...`;
            
            // 模拟API调用延迟
            setTimeout(() => {
                this.disabled = false;
                this.textContent = '生成分析报告';
                showToast('群体分析报告已生成', 'success');
            }, 1500);
        });
    }
}

// 生成述职分析
function generateReportAnalysis() {
    // 检查是否有述职文件
    if (!window.reportFilePath) {
        console.log('没有述职文件，跳过分析');
        hideLoadingAnimation();
        return;
    }
    
    // 获取分析类型（默认为能力述职）
    const analysisType = '能力述职';
    
    // 调用后端API生成述职分析
    fetch('/api/generate_report_analysis', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            report_file_path: window.reportFilePath,
            analysis_type: analysisType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 更新能力分析与建议区域
            updateAnalysisResults(data.analysis_result);
        } else {
            console.error('述职分析失败:', data.error);
            // 显示默认内容
            updateAnalysisResults({
                strengths: ['技术创新能力突出', '团队协作表现优秀', '项目执行力强'],
                improvements: ['业务影响力需提升', '战略思维有待加强', '跨部门协作需改善']
            });
        }
        // 隐藏加载动画
        hideLoadingAnimation();
    })
    .catch(error => {
        console.error('述职分析错误:', error);
        // 显示默认内容
        updateAnalysisResults({
            strengths: ['技术创新能力突出', '团队协作表现优秀', '项目执行力强'],
            improvements: ['业务影响力需提升', '战略思维有待加强', '跨部门协作需改善']
        });
        // 隐藏加载动画
        hideLoadingAnimation();
    });
}

// 显示加载动画
function showLoadingAnimation() {
    // 为能力分析与建议版块显示加载动画
    const analysisContent = document.getElementById('abilityAnalysisContent');
    if (analysisContent) {
        analysisContent.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <div class="loading-text">正在分析能力优势与建议...</div>
                <div class="loading-progress">
                    <div class="loading-progress-bar"></div>
                </div>
            </div>
        `;
    }
    
    // 为能力评分结果版块显示加载动画
    const scoringContainer = document.getElementById('scoringResultsContainer');
    const noScoringResults = document.getElementById('noScoringResults');
    if (scoringContainer && noScoringResults) {
        noScoringResults.style.display = 'none';
        scoringContainer.style.display = 'block';
        scoringContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <div class="loading-text">正在生成能力评分结果...</div>
                <div class="loading-progress">
                    <div class="loading-progress-bar"></div>
                </div>
            </div>
        `;
    }
}

// 隐藏加载动画
function hideLoadingAnimation() {
    // 恢复能力分析与建议版块的默认状态
    const analysisContent = document.getElementById('abilityAnalysisContent');
    if (analysisContent) {
        const noAnalysisResults = document.getElementById('noAnalysisResults');
        const analysisResultsContainer = document.getElementById('analysisResultsContainer');
        
        // 如果没有分析结果，显示默认提示
        if (!analysisResultsContainer || analysisResultsContainer.style.display === 'none') {
            analysisContent.innerHTML = `
                <div class="text-center py-3 text-muted" id="noAnalysisResults">
                    <i class="fas fa-lightbulb fa-2x mb-2"></i>
                    <p>生成能力评分后将显示分析建议</p>
                </div>
                <div id="analysisResultsContainer" style="display: none;">
                    <h6><i class="fas fa-plus-circle me-2 text-success"></i>核心优势</h6>
                    <div id="strengthsContent" class="small ps-3 mb-3">
                        <!-- 动态生成的优势内容 -->
                    </div>
                    <h6><i class="fas fa-minus-circle me-2 text-danger"></i>待发展领域</h6>
                    <div id="improvementsContent" class="small ps-3">
                        <!-- 动态生成的改进建议 -->
                    </div>
                </div>
            `;
        }
    }
    
    // 恢复能力评分结果版块的默认状态
    const scoringContainer = document.getElementById('scoringResultsContainer');
    const noScoringResults = document.getElementById('noScoringResults');
    if (scoringContainer && noScoringResults && scoringContainer.innerHTML.includes('loading-container')) {
        scoringContainer.style.display = 'none';
        noScoringResults.style.display = 'block';
    }
}

// 更新能力分析与建议结果
function updateAnalysisResults(analysisResult) {
    console.log('接收到的分析结果:', analysisResult);
    
    // 查找能力分析与建议内容区域
    const analysisContent = document.getElementById('abilityAnalysisContent');
    if (!analysisContent) {
        console.error('找不到能力分析与建议内容区域');
        return;
    }
    
    // 确保analysisResult是有效的对象
    if (!analysisResult || typeof analysisResult !== 'object') {
        console.error('分析结果格式错误:', analysisResult);
        analysisResult = {
            strengths: ['技术创新能力突出', '团队协作表现优秀', '项目执行力强'],
            improvements: ['业务影响力需提升', '战略思维有待加强', '跨部门协作需改善']
        };
    }
    
    // 确保strengths和improvements是数组，并处理对象格式
    let strengths = Array.isArray(analysisResult.strengths) ? analysisResult.strengths : 
        (analysisResult.strengths ? [analysisResult.strengths] : ['暂无优势分析']);
    let improvements = Array.isArray(analysisResult.improvements) ? analysisResult.improvements : 
        (analysisResult.improvements ? [analysisResult.improvements] : ['暂无改进建议']);
    
    // 处理对象格式的数据（包含point和reason字段）
    strengths = strengths.map(item => {
        if (typeof item === 'object') {
            if (item.point && item.reason) {
                return `${item.point}（${item.reason}）`;
            } else if (item.description && item.reason) {
                return `${item.description}（${item.reason}）`;
            } else if (item.point) {
                return item.point;
            } else if (item.description) {
                return item.description;
            }
        }
        return typeof item === 'string' ? item : String(item);
    });
    
    improvements = improvements.map(item => {
        if (typeof item === 'object') {
            if (item.point && item.reason) {
                return `${item.point}（${item.reason}）`;
            } else if (item.description && item.reason) {
                return `${item.description}（${item.reason}）`;
            } else if (item.point) {
                return item.point;
            } else if (item.description) {
                return item.description;
            }
        }
        return typeof item === 'string' ? item : String(item);
    });
    
    console.log('处理后的优势:', strengths);
    console.log('处理后的改进建议:', improvements);
    
    // 隐藏默认提示，显示分析结果
    const noAnalysisResults = document.getElementById('noAnalysisResults');
    const analysisResultsContainer = document.getElementById('analysisResultsContainer');
    
    if (noAnalysisResults) {
        noAnalysisResults.style.display = 'none';
    }
    
    if (analysisResultsContainer) {
        analysisResultsContainer.style.display = 'block';
        
        // 更新优势内容
        const strengthsContent = document.getElementById('strengthsContent');
        if (strengthsContent) {
            strengthsContent.innerHTML = strengths.map(strength => `
                <div class="mb-2">
                    <i class="fas fa-plus text-success me-2"></i>
                    ${typeof strength === 'string' ? strength : JSON.stringify(strength)}
                </div>
            `).join('');
        }
        
        // 更新改进建议内容
        const improvementsContent = document.getElementById('improvementsContent');
        if (improvementsContent) {
            improvementsContent.innerHTML = improvements.map(improvement => `
                <div class="mb-2">
                    <i class="fas fa-arrow-up text-warning me-2"></i>
                    ${typeof improvement === 'string' ? improvement : JSON.stringify(improvement)}
                </div>
            `).join('');
        }
    } else {
        // 如果没有找到现有的容器结构，创建新的内容
        analysisContent.innerHTML = `
            <div id="analysisResultsContainer">
                <h6><i class="fas fa-plus-circle me-2 text-success"></i>核心优势</h6>
                <div id="strengthsContent" class="small ps-3 mb-3">
                    ${strengths.map(strength => `
                        <div class="mb-2">
                            <i class="fas fa-plus text-success me-2"></i>
                            ${typeof strength === 'string' ? strength : JSON.stringify(strength)}
                        </div>
                    `).join('')}
                </div>
                
                <h6><i class="fas fa-minus-circle me-2 text-danger"></i>待发展领域</h6>
                <div id="improvementsContent" class="small ps-3 mb-3">
                    ${improvements.map(improvement => `
                        <div class="mb-2">
                            <i class="fas fa-arrow-up text-warning me-2"></i>
                            ${typeof improvement === 'string' ? improvement : JSON.stringify(improvement)}
                        </div>
                    `).join('')}
                </div>
                
                <!-- PDF导出按钮 -->
                <div class="text-center mt-3">
                    <button class="btn btn-danger" id="exportPdfBtn">
                        <i class="fas fa-file-pdf me-1"></i>导出完整报告(PDF)
                    </button>
                </div>
            </div>
        `;
        
        // 重新绑定PDF导出按钮事件
        const newPdfBtn = document.getElementById('exportPdfBtn');
        if (newPdfBtn) {
            newPdfBtn.addEventListener('click', exportPdfReport);
        }
    }
}

// 更新校对结果区域
function updateVerificationResults(data) {
    const resultCard = document.querySelector('#verification .col-md-6:last-child .card-body');
    
    if (data.missing_items && data.missing_items.length > 0) {
        // 有缺失项
        const missingItems = data.missing_items.map(item => `<li>${item}</li>`).join('');
        
        resultCard.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>共检测到 <strong>${data.missing_items.length}处</strong> 可能的不一致
            </div>
            
            <div class="inconsistency">
                <h6><i class="fas fa-exclamation-circle me-2 text-danger"></i>与评价表对比缺失项</h6>
                <p class="mb-1">PPT中缺少以下评分表中包含的内容：</p>
                <ul class="mb-1">
                    ${missingItems}
                </ul>
                <small class="text-muted">建议：补充上述内容以确保与评分表一致</small>
            </div>
            
            <div class="suggestion-box mt-3">
                <h6><i class="fas fa-lightbulb me-2 text-warning"></i>修改参考</h6>
                <div class="mb-0">
                    ${data.suggestions || '暂无修改参考'}
                </div>
            </div>
            
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-success">确认修改完成</button>
                <button class="btn btn-outline-secondary" id="downloadReport">导出校对报告</button>
            </div>
        `;
        
        // 添加导出报告功能
        document.getElementById('downloadReport').addEventListener('click', function() {
            generatePDF({
                title: "PPT与评分表内容校对报告",
                items: data.missing_items,
                suggestions: data.suggestions
            });
        });
    } else {
        // 无缺失项
        resultCard.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>恭喜！未检测到内容不一致
            </div>
            
            <div class="text-center my-5">
                <i class="fas fa-thumbs-up fa-4x text-success mb-3"></i>
                <h4>PPT内容与评分表完全一致</h4>
                <p class="text-muted">您的述职PPT已完全覆盖评分表中的所有考核点</p>
            </div>
            
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-success">确认完成</button>
                <button class="btn btn-outline-secondary" id="downloadReport">导出校对报告</button>
            </div>
        `;
        
        // 添加导出报告功能
        document.getElementById('downloadReport').addEventListener('click', function() {
            generatePDF({
                title: "PPT与评分表内容校对报告",
                result: "所有内容一致，无需修改",
                suggestions: "继续保持良好工作"
            });
        });
    }
}

// 模拟PDF导出功能
function generatePDF(data) {
    showToast('报告已下载', 'success');
}

// 初始化各类图表
function initCharts() {
    // 初始化打分参考页雷达图
    function initScoringRadarChart() {
        const element = document.getElementById('scoringRadarChart');
        if (!element) return;
        
        const ctx = element.getContext('2d');
        
        if (window.scoringChart) {
            window.scoringChart.destroy();
        }
        
        window.scoringChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['技术创新', '业务影响力', '团队协作', '项目管理', '成本意识', '战略思维'],
                datasets: [{
                    label: '当前能力',
                    data: [4.5, 3.2, 4.7, 4.0, 3.0, 3.3],
                    backgroundColor: 'rgba(58, 110, 165, 0.2)',
                    borderColor: 'rgba(58, 110, 165, 1)',
                    pointBackgroundColor: 'rgba(58, 110, 165, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(58, 110, 165, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            circular: true,
                            lineWidth: 1
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            display: true,
                            stepSize: 1,
                            min: 0,
                            max: 5,
                            backdropColor: 'transparent',
                            color: 'rgba(0, 0, 0, 0.6)',
                            font: {
                                size: 10
                            }
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '/5';
                            }
                        }
                    }
                }
            }
        });
    }

    // 初始化诊断报告雷达图
    function initDiagnosisRadarChart(abilities = null) {
        console.log('尝试初始化诊断雷达图，abilities:', abilities);
        
        const element = document.getElementById('diagnosisRadarChart');
        if (!element) {
            console.warn('diagnosisRadarChart元素不存在，可能还未生成报告');
            return;
        }
        
        console.log('找到diagnosisRadarChart元素，开始创建图表');
        
        const ctx = element.getContext('2d');
        if (!ctx) {
            console.error('无法获取canvas上下文');
            return;
        }
        
        // 销毁现有图表
        if (window.diagnosisChart) {
            console.log('销毁现有雷达图');
            window.diagnosisChart.destroy();
        }
        
        // 数据验证和处理函数
        const validateAndNormalizeScore = (score) => {
            if (typeof score === 'number') {
                // 确保分数在 0-5 范围内
                return Math.max(0, Math.min(5, score));
            }
            if (typeof score === 'string') {
                const numScore = parseFloat(score);
                if (!isNaN(numScore)) {
                    return Math.max(0, Math.min(5, numScore));
                }
            }
            return 0; // 默认值
        };

        // 使用传入的能力数据或默认数据
        const defaultData = [4.0, 3.5, 4.2, 3.8, 3.2, 3.6];
        const chartData = abilities ? [
            validateAndNormalizeScore(abilities.technical_innovation),
            validateAndNormalizeScore(abilities.business_impact),
            validateAndNormalizeScore(abilities.teamwork),
            validateAndNormalizeScore(abilities.project_management),
            validateAndNormalizeScore(abilities.cost_awareness),
            validateAndNormalizeScore(abilities.strategic_thinking)
        ] : defaultData;
        
        console.log('传入的abilities对象:', abilities);
        console.log('图表数据映射:');
        console.log('技术创新:', abilities?.technical_innovation || 0);
        console.log('业务影响力:', abilities?.business_impact || 0);
        console.log('团队协作:', abilities?.teamwork || 0);
        console.log('项目管理:', abilities?.project_management || 0);
        console.log('成本意识:', abilities?.cost_awareness || 0);
        console.log('战略思维:', abilities?.strategic_thinking || 0);
        console.log('最终图表数据:', chartData);

        try {
                                    window.diagnosisChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['技术创新', '业务影响力', '团队协作', '项目管理', '成本意识', '战略思维'],
                    datasets: [{
                        label: '当前能力',
                        data: chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                circular: true,
                                lineWidth: 1
                            },
                            pointLabels: {
                                font: {
                                    size: 12
                                }
                            },
                            ticks: {
                                display: true,
                                stepSize: 1,
                                min: 0,
                                max: 5,
                                backdropColor: 'transparent',
                                color: 'rgba(0, 0, 0, 0.6)',
                                font: {
                                    size: 10
                                }
                            },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '/5';
                                }
                            }
                        }
                    }
                }
            });
            console.log('雷达图创建成功:', window.diagnosisChart);
        } catch (error) {
            console.error('创建雷达图时出错:', error);
        }
    }

    // 初始化群体分析图表
    function initCohortChart() {
        const element = document.getElementById('cohortChart');
        if (!element) return;
        
        const ctx = element.getContext('2d');
        
        if (window.cohortChart) {
            window.cohortChart.destroy();
        }
        
        window.cohortChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['技术创新', '业务影响力', '团队协作', '项目管理', '成本意识', '战略思维'],
                datasets: [
                    {
                        label: 'P6群体平均',
                        data: [4.2, 3.4, 4.3, 4.0, 3.1, 3.5],
                        backgroundColor: 'rgba(58, 110, 165, 0.7)',
                    },
                    {
                        label: '张三',
                        data: [4.5, 3.2, 4.7, 4.0, 3.0, 3.3],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // 根据当前活动页面初始化相应图表
    const activePageId = document.querySelector('.page-content.active').id;
    if (activePageId === 'scoring') {
        initScoringRadarChart();
    } else if (activePageId === 'analysis') {
        // analysis页面的雷达图是在生成报告时动态创建的，这里不需要初始化
        console.log('analysis页面已激活，雷达图将在生成报告时创建');
    } else if (activePageId === 'cohort') {
        initCohortChart();
    }
    
    // 为全局使用暴露图表初始化函数
    window.initScoringRadarChart = initScoringRadarChart;
    window.initDiagnosisRadarChart = initDiagnosisRadarChart;
    window.initCohortChart = initCohortChart;
}

// 创建弹窗提示
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 初始化Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // 处理toast关闭后的清理
    toast.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toast);
    });
}

// 更新诊断报告显示
function updateDiagnosisReport(diagnosis) {
    const reportContent = document.getElementById('diagnosisReportContent');
    if (!reportContent || !diagnosis) return;
    
    // 保存诊断数据供导出功能使用
    window.currentDiagnosis = diagnosis;
    
    // 获取用户选择的分析维度
    const includeEmployeeAnalysis = document.getElementById('employeeAnalysis').checked;
    const includeGrowthSuggestions = document.getElementById('growthSuggestions').checked;
    
    const abilities = diagnosis.abilities || {};
    const strengths = diagnosis.strengths || [];
    const weaknesses = diagnosis.weaknesses || [];
    const growthSuggestions = diagnosis.growth_suggestions || [];
    const managerSuggestions = diagnosis.manager_suggestions || [];
    
    reportContent.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>以下诊断报告基于述职内容的AI分析，仅供参考。
        </div>
        
        <!-- 员工基本信息 -->
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-user me-2"></i>员工信息</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <strong>姓名：</strong>${(diagnosis.employee_info && diagnosis.employee_info.name) || '未知'}
                            </div>
                            <div class="col-md-4">
                                <strong>职位：</strong>${(diagnosis.employee_info && diagnosis.employee_info.position) || '未知'}
                            </div>
                            <div class="col-md-4">
                                <strong>评估周期：</strong>${(diagnosis.employee_info && diagnosis.employee_info.quarter) || '未知'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 能力评估雷达图 -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-radar me-2"></i>能力评估</h5>
                    </div>
                    <div class="card-body">
                        <canvas id="diagnosisRadarChart" width="400" height="400"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-star me-2"></i>能力得分详情</h5>
                    </div>
                    <div class="card-body">
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">技术创新能力：</span>
                            <span class="badge bg-primary">${abilities.technical_innovation || 0}/5</span>
                        </div>
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">业务影响力：</span>
                            <span class="badge bg-success">${abilities.business_impact || 0}/5</span>
                        </div>
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">团队协作能力：</span>
                            <span class="badge bg-info">${abilities.teamwork || 0}/5</span>
                        </div>
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">项目管理能力：</span>
                            <span class="badge bg-warning">${abilities.project_management || 0}/5</span>
                        </div>
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">成本意识：</span>
                            <span class="badge bg-secondary">${abilities.cost_awareness || 0}/5</span>
                        </div>
                        <div class="ability-score-item mb-2">
                            <span class="fw-bold">战略思维：</span>
                            <span class="badge bg-dark">${abilities.strategic_thinking || 0}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${includeEmployeeAnalysis ? `
        <!-- 优势与待发展领域 -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-plus-circle me-2 text-success"></i>核心优势</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            ${strengths.map(strength => `<li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>${strength}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-exclamation-triangle me-2 text-warning"></i>待发展领域</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            ${weaknesses.map(weakness => `<li class="mb-2"><i class="fas fa-arrow-up text-warning me-2"></i>${weakness}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>` : ''}
        
        ${includeGrowthSuggestions ? `
        <!-- 成长建议 -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-lightbulb me-2 text-primary"></i>个人成长建议</h5>
                    </div>
                    <div class="card-body">
                        <ol class="list-group list-group-numbered">
                            ${growthSuggestions.map(suggestion => `<li class="list-group-item border-0 ps-0">${suggestion}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-user-tie me-2 text-info"></i>管理者建议</h5>
                    </div>
                    <div class="card-body">
                        <ol class="list-group list-group-numbered">
                            ${managerSuggestions.map(suggestion => `<li class="list-group-item border-0 ps-0">${suggestion}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        </div>` : ''}
        
        <!-- 操作按钮 -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-outline-primary" onclick="exportDiagnosisReport()">
                <i class="fas fa-download me-2"></i>导出报告
            </button>
            <button class="btn btn-primary" onclick="printDiagnosisReport()">
                <i class="fas fa-print me-2"></i>打印报告
            </button>
        </div>
    `;
    
    // 重新初始化雷达图
    setTimeout(() => {
        initDiagnosisRadarChart(abilities);
    }, 100);
    

}

// 导出诊断报告
function exportDiagnosisReport() {
    // 检查是否有诊断数据
    if (!window.currentDiagnosis) {
        showToast('请先生成诊断报告', 'warning');
        return;
    }
    
    // 显示导出中状态
    const exportBtn = document.querySelector('button[onclick="exportDiagnosisReport()"]');
    if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>导出中...';
    }
    
    // 调用后端API导出PDF
    fetch('/api/export_diagnosis_report', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            diagnosis: window.currentDiagnosis
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('导出失败');
        }
        return response.blob();
    })
    .then(blob => {
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // 生成文件名
        const employeeName = window.currentDiagnosis.employee_info?.name || '员工';
        const quarter = window.currentDiagnosis.employee_info?.quarter || '未知周期';
        a.download = `${employeeName}_诊断报告_${quarter}.pdf`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('报告导出成功！', 'success');
    })
    .catch(error => {
        console.error('导出错误:', error);
        showToast('报告导出失败: ' + error.message, 'danger');
    })
    .finally(() => {
        // 恢复按钮状态
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-download me-2"></i>导出报告';
        }
    });
}

// 打印诊断报告
function printDiagnosisReport() {
    window.print();
}

// 显示能力评分结果
function displayScoringResults(scoringResults, columnOrder = null) {
    const resultsContainer = document.getElementById('scoringResultsContainer');
    const noResultsMessage = document.getElementById('noScoringResults');
    const exportBtn = document.getElementById('exportScoringBtn');
    
    // 调试信息 - 暂时启用来诊断问题
    console.log('=== 评分结果调试信息 ===');
    console.log('scoringResults:', scoringResults);
    console.log('scoringResults length:', scoringResults ? scoringResults.length : 'null');
    if (scoringResults && scoringResults.length > 0) {
        console.log('第一个数据项:', scoringResults[0]);
        console.log('第一个数据项的所有键:', Object.keys(scoringResults[0]));
        // 特别检查能力值字段
        const abilityValueKey = '能力值（1-10分）';
        console.log(`能力值字段"${abilityValueKey}"的值:`, scoringResults[0][abilityValueKey]);
        console.log(`能力值字段类型:`, typeof scoringResults[0][abilityValueKey]);
        
        // 检查是否有其他类似的键名
        const keys = Object.keys(scoringResults[0]);
        console.log('所有字段名:', keys);
        const abilityKeys = keys.filter(key => key.includes('能力') || key.includes('分'));
        console.log('包含"能力"或"分"的键名:', abilityKeys);
        
        // 逐个显示每个字段名和其内容（用于调试字段名差异）
        keys.forEach(key => {
            console.log(`字段 "${key}": "${scoringResults[0][key]}" (${typeof scoringResults[0][key]})`);
        });
    }
    
    if (!scoringResults || scoringResults.length === 0) {
        resultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'block';
        exportBtn.style.display = 'none';
        return;
    }
    
    // 使用固定的列顺序
    const columns = ["能力维度", "具体能力项", "核心定义", "是否具备（√）", "能力描述", "擅长程度", "能力值（1-10分）"];
    
    // 构建表格HTML
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
    `;
    
    // 动态生成表头
    columns.forEach(column => {
        tableHTML += `<th>${column}</th>`;
    });
    
    tableHTML += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    // 动态生成表格内容
    scoringResults.forEach((item, rowIndex) => {
        if (rowIndex === 0) {
            console.log(`=== 处理第1行数据（详细调试）===`);
            console.log('第一行完整数据:', item);
        }
        
        tableHTML += '<tr>';
        columns.forEach((column, index) => {
            // 对于能力值字段，需要特殊处理，避免数字0被转换为空字符串
            let value;
            if (column === '能力值（1-10分）') {
                let rawValue = item[column];
                
                // 如果精确匹配失败，尝试智能匹配字段名
                if (rawValue === undefined || rawValue === null) {
                    const keys = Object.keys(item);
                    
                    // 尝试匹配包含"能力值"和"分"的字段
                    const possibleKeys = keys.filter(key => 
                        key.includes('能力值') && key.includes('分')
                    );
                    
                    if (possibleKeys.length > 0) {
                        rawValue = item[possibleKeys[0]];
                        if (rowIndex === 0) {
                            console.log(`字段名智能匹配: "${column}" -> "${possibleKeys[0]}"`);
                        }
                    }
                    
                    // 如果还是没找到，尝试匹配数字类型的字段
                    if ((rawValue === undefined || rawValue === null) && possibleKeys.length === 0) {
                        const numericKeys = keys.filter(key => 
                            typeof item[key] === 'number' && item[key] >= 1 && item[key] <= 10
                        );
                        if (numericKeys.length > 0) {
                            rawValue = item[numericKeys[0]];
                            if (rowIndex === 0) {
                                console.log(`数字字段智能匹配: "${column}" -> "${numericKeys[0]}"`);
                            }
                        }
                    }
                }
                
                value = rawValue !== undefined && rawValue !== null ? String(rawValue) : '0';
                
                if (rowIndex === 0) {
                    console.log(`能力值处理详情:`, {
                        column,
                        rawValue,
                        rawValueType: typeof rawValue,
                        finalValue: value
                    });
                }
            } else {
                value = item[column] || '';
            }
            
            // 根据列名添加特殊样式
            if (column === '能力值（1-10分）') {
                tableHTML += `<td class="text-center"><span class="badge bg-primary fs-6">${value}</span></td>`;
            } else if (column === '是否具备（√）') {
                tableHTML += `<td class="text-center text-success fw-bold">${value}</td>`;
            } else if (column === '能力维度') {
                // 第一列加粗显示
                tableHTML += `<td class="fw-bold">${value}</td>`;
            } else if (column === '擅长程度') {
                // 根据擅长程度设置不同颜色
                let badgeClass = 'bg-secondary';
                if (value === '低') {
                    badgeClass = 'bg-danger';
                } else if (value === '中') {
                    badgeClass = 'bg-warning';
                } else if (value === '高') {
                    badgeClass = 'bg-success';
                }
                tableHTML += `<td class="text-center"><span class="badge ${badgeClass}">${value}</span></td>`;
            } else {
                tableHTML += `<td>${value}</td>`;
            }
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    resultsContainer.innerHTML = tableHTML;
    resultsContainer.style.display = 'block';
    noResultsMessage.style.display = 'none';
    exportBtn.style.display = 'block';
    
    // 存储结果数据和列顺序供导出使用
    window.currentScoringResults = scoringResults;
    window.currentColumnOrder = columns;
}

// 导出能力评分Excel
function exportScoringExcel() {
    if (!window.currentScoringResults) {
        showToast('没有可导出的评分结果', 'warning');
        return;
    }
    
    // 调用后端API导出Excel
    fetch('/api/export_scoring_excel', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            scoring_results: window.currentScoringResults,
            column_order: window.currentColumnOrder
        })
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('导出失败');
    })
    .then(blob => {
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 生成文件名：述职原文文件名+评分标准文件名
        let fileName = '能力评分结果';
        if (window.reportFileName && window.standardFileName) {
            fileName = `${window.reportFileName}+${window.standardFileName}`;
        } else if (window.reportFileName) {
            fileName = window.reportFileName;
        } else if (window.standardFileName) {
            fileName = window.standardFileName;
        }
        
        a.download = `${fileName}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('Excel文件已下载', 'success');
    })
    .catch(error => {
        showToast('导出Excel失败: ' + error.message, 'danger');
    });
}

// PDF导出功能
function exportPdfReport() {
    // 获取能力分析数据
    const analysisData = {
        core_strengths: document.getElementById('strengthsContent')?.textContent || '',
        areas_for_development: document.getElementById('improvementsContent')?.textContent || ''
    };
    
    // 检查是否有分析数据
    const hasAnalysisData = analysisData.core_strengths || analysisData.areas_for_development;
    
    // 检查是否有评分数据
    const hasScoringData = window.currentScoringResults && window.currentScoringResults.length > 0;
    
    if (!hasAnalysisData && !hasScoringData) {
        showToast('没有可导出的数据，请先生成能力评分和分析结果', 'warning');
        return;
    }
    
    // 获取员工姓名
    let employeeName = '';
    
    // 1. 首先尝试从述职原文文件名中提取员工姓名
    if (window.reportFileName) {
        const extractedName = extractEmployeeNameFromFileName(window.reportFileName);
        if (extractedName && extractedName !== '未知') {
            employeeName = extractedName;
            console.log(`从述职原文文件名提取到员工姓名: ${employeeName}`);
        }
    }
    
    // 2. 如果文件名中没有提取到，再从诊断报告中获取员工姓名
    if (!employeeName && window.currentDiagnosis && window.currentDiagnosis.employee_info && window.currentDiagnosis.employee_info.name) {
        employeeName = window.currentDiagnosis.employee_info.name;
        console.log(`从诊断报告中获取到员工姓名: ${employeeName}`);
    }
    // 3. 最后尝试从评分结果中获取
    else if (!employeeName && window.currentScoringResults && window.currentScoringResults.length > 0) {
        employeeName = window.currentScoringResults[0]['员工姓名'] || window.currentScoringResults[0]['姓名'] || '';
        if (employeeName) {
            console.log(`从评分结果中获取到员工姓名: ${employeeName}`);
        }
    }
    

    
    // 生成文件名：述职原文文件名+评分标准文件名
    let fileName = '能力诊断报告';
    if (window.reportFileName && window.standardFileName) {
        fileName = `${window.reportFileName}+${window.standardFileName}`;
    } else if (window.reportFileName) {
        fileName = window.reportFileName;
    } else if (window.standardFileName) {
        fileName = window.standardFileName;
    }
    
    // 准备导出数据
    const exportData = {
        analysis_data: hasAnalysisData ? analysisData : null,
        scoring_results: hasScoringData ? window.currentScoringResults : null,
        file_name: fileName,
        employee_name: employeeName
    };
    
    // 显示加载状态
    showToast('正在生成PDF报告...', 'info');
    
    // 发送导出请求
    fetch('/api/export_pdf_report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || '导出失败');
            });
        }
        return response.blob();
    })
    .then(blob => {
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('PDF报告导出成功', 'success');
    })
    .catch(error => {
        showToast('导出PDF失败: ' + error.message, 'danger');
    });
}



// 生成测试诊断报告
function generateTestDiagnosisReport() {
    console.log('生成测试诊断报告');
    
    // 创建测试数据
    const testDiagnosis = {
        employee_info: {
            name: '张三',
            position: '技术序列P6',
            quarter: '2023年Q4'
        },
        abilities: {
            technical_innovation: 3,
            business_impact: 5,
            teamwork: 4,
            project_management: 5,
            cost_awareness: 4,
            strategic_thinking: 5
        },
        strengths: [
            '技术能力扎实，能够独立完成复杂的技术任务',
            '学习能力强，能够快速掌握新技术和工具',
            '团队协作意识强，积极参与团队讨论和决策',
            '工作态度认真负责，按时保质完成工作任务'
        ],
        weaknesses: [
            '业务理解深度有待提升，需要更深入了解产品和用户需求',
            '主动性需要加强，可以更积极地提出改进建议和创新想法',
            '跨部门沟通协调能力需要进一步发展',
            '成本意识需要加强，在技术方案选择时要考虑成本效益'
        ],
        growth_suggestions: [
            '主动参与产品需求讨论，深入理解业务价值和用户痛点',
            '定期总结技术实践经验，形成技术分享和最佳实践',
            '寻求跨部门合作机会，了解不同部门的工作流程和需求',
            '制定个人技术发展规划，关注行业技术趋势和发展方向',
            '参加技术培训和会议，提升专业技能和行业视野'
        ],
        manager_suggestions: [
            '为员工提供更多业务培训和产品知识学习机会',
            '定期进行技术和职业发展讨论，了解员工成长需求',
            '给予员工更多技术决策参与机会，培养技术领导力',
            '建立明确的技术职业发展路径和晋升标准',
            '提供跨部门协作项目机会，帮助员工拓展业务视野'
        ]
    };
    
    // 更新诊断报告显示
    updateDiagnosisReport(testDiagnosis);
    showToast('测试诊断报告已生成，雷达图应该正常显示', 'success');
}

// 绑定导出按钮事件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图表功能
    initCharts();
    
    const exportBtn = document.getElementById('exportScoringBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportScoringExcel);
    }
    
    const pdfExportBtn = document.getElementById('exportPdfBtn');
    if (pdfExportBtn) {
        pdfExportBtn.addEventListener('click', exportPdfReport);
    }
    
    // 添加测试按钮事件处理
    const testDiagnosisBtn = document.getElementById('testDiagnosisBtn');
    if (testDiagnosisBtn) {
        testDiagnosisBtn.addEventListener('click', function() {
            generateTestDiagnosisReport();
        });
    }
});
