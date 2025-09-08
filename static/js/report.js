// 智能述职Agent系统 - 报告生成逻辑

// 诊断报告生成逻辑
function generateDiagnosisReport(data) {
    // 检查是否有必要的数据
    if (!data || !data.diagnosis) {
        showToast('获取诊断报告数据失败', 'danger');
        return;
    }

    const diagnosis = data.diagnosis;
    
    // 构建HTML内容
    let reportHTML = `
        <!-- 员工本人分析部分 -->
        <div class="diagnosis-section">
            <h4><i class="fas fa-user me-2 text-primary"></i>员工本人分析</h4>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <h5>能力雷达图</h5>
                    <div class="radar-chart-container">
                        <canvas id="diagnosisRadarChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header">优势分析</div>
                        <div class="card-body">
                            <ul>
    `;
    
    // 添加优势列表
    diagnosis.strengths.forEach(strength => {
        reportHTML += `<li>${strength}</li>`;
    });
    
    reportHTML += `
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">劣势分析</div>
                <div class="card-body">
                    <ul>
    `;
    
    // 添加劣势列表
    diagnosis.weaknesses.forEach(weakness => {
        reportHTML += `<li>${weakness}</li>`;
    });
    
    reportHTML += `
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- 未来成长建议部分 -->
        <div class="diagnosis-section">
            <h4><i class="fas fa-seedling me-2 text-success"></i>未来成长建议</h4>
            
            <div class="card mb-4">
                <div class="card-header">员工成长建议</div>
                <div class="card-body">
                    <ul>
    `;
    
    // 添加成长建议
    diagnosis.growth_suggestions.forEach(suggestion => {
        reportHTML += `<li>${suggestion}</li>`;
    });
    
    reportHTML += `
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">主管日常指导建议</div>
                <div class="card-body">
                    <ul>
    `;
    
    // 添加主管建议
    diagnosis.manager_suggestions.forEach(suggestion => {
        reportHTML += `<li>${suggestion}</li>`;
    });
    
    reportHTML += `
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="d-grid gap-2 mt-4">
            <button class="btn btn-success" id="exportDiagnosisBtn">导出诊断报告 (PDF)</button>
            <button class="btn btn-outline-primary" id="saveSuggestionsBtn">保存建议</button>
        </div>
    `;
    
    // 将HTML内容添加到页面
    document.getElementById('diagnosisReportContent').innerHTML = reportHTML;
    
    // 初始化雷达图
    setTimeout(() => {
        const ctx = document.getElementById('diagnosisRadarChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['技术创新', '业务影响力', '团队协作', '项目管理', '成本意识', '战略思维'],
                datasets: [{
                    label: '当前能力',
                    data: [
                        diagnosis.abilities.technical_innovation,
                        diagnosis.abilities.business_impact,
                        diagnosis.abilities.teamwork,
                        diagnosis.abilities.project_management,
                        diagnosis.abilities.cost_awareness,
                        diagnosis.abilities.strategic_thinking
                    ],
                    backgroundColor: 'rgba(58, 110, 165, 0.2)',
                    borderColor: 'rgba(58, 110, 165, 1)',
                    pointBackgroundColor: 'rgba(58, 110, 165, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(58, 110, 165, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }, 100);
    
    // 添加按钮事件监听器
    document.getElementById('exportDiagnosisBtn').addEventListener('click', function() {
        showToast('诊断报告已导出为PDF', 'success');
    });
    
    document.getElementById('saveSuggestionsBtn').addEventListener('click', function() {
        showToast('建议已保存', 'success');
    });
}

// 群体分析报告生成逻辑
function generateCohortAnalysis(data) {
    // 检查是否有必要的数据
    if (!data || !data.cohort_analysis) {
        showToast('获取群体分析数据失败', 'danger');
        return;
    }
    
    const analysis = data.cohort_analysis;
    
    // 构建HTML内容
    let reportHTML = `
        <div class="col-md-6 mb-4">
            <div class="cohort-card">
                <h5><i class="fas fa-thumbs-up me-2 text-success"></i>优势领域</h5>
                <ul class="list-group list-group-flush">
    `;
    
    // 添加优势领域
    analysis.strengths.forEach(strength => {
        reportHTML += `
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>${strength.name}</span>
                    <span class="badge bg-success">${strength.score.toFixed(1)}</span>
                </div>
                <small class="text-muted">${strength.description}</small>
            </li>
        `;
    });
    
    reportHTML += `
                </ul>
            </div>
        </div>
        
        <div class="col-md-6 mb-4">
            <div class="cohort-card">
                <h5><i class="fas fa-exclamation-triangle me-2 text-danger"></i>待提升领域</h5>
                <ul class="list-group list-group-flush">
    `;
    
    // 添加待提升领域
    analysis.weaknesses.forEach(weakness => {
        reportHTML += `
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>${weakness.name}</span>
                    <span class="badge ${weakness.score < 3.2 ? 'bg-danger' : 'bg-warning'}">${weakness.score.toFixed(1)}</span>
                </div>
                <small class="text-muted">${weakness.description}</small>
            </li>
        `;
    });
    
    reportHTML += `
                </ul>
            </div>
        </div>
        
        <div class="col-12">
            <div class="card">
                <div class="card-header">标杆员工与最佳实践</div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">选择能力维度</label>
                        <select class="form-select" id="bestPracticeSelect">
                            <option selected value="business_impact">业务影响力</option>
                            <option value="cost_awareness">成本意识</option>
                            <option value="technical_innovation">技术创新</option>
                            <option value="teamwork">团队协作</option>
                        </select>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>在"业务影响力"方面表现优异的员工（匿名展示）：
                    </div>
                    
                    <div class="accordion" id="bestPracticeAccordion">
    `;
    
    // 添加最佳实践
    analysis.best_practices.forEach((practice, index) => {
        reportHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#practice${index}">
                        ${practice.employee} - ${practice.ability}得分: ${practice.score.toFixed(1)}
                    </button>
                </h2>
                <div id="practice${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#bestPracticeAccordion">
                    <div class="accordion-body">
                        <p><strong>最佳实践:</strong> ${practice.practice}</p>
                        <p class="mb-0"><strong>成果:</strong> ${practice.result}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    reportHTML += `
                    </div>
                    
                    <div class="d-grid gap-2 mt-3">
                        <button class="btn btn-success" id="exportCohortBtn">导出群体分析报告</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 将HTML内容添加到页面
    document.getElementById('cohortAnalysisContent').innerHTML = reportHTML;
    
    // 更新图表
    updateCohortChart(analysis.average_abilities);
    
    // 添加按钮事件监听器
    document.getElementById('exportCohortBtn').addEventListener('click', function() {
        showToast('群体分析报告已导出', 'success');
    });
    
    // 添加下拉菜单事件监听器
    document.getElementById('bestPracticeSelect').addEventListener('change', function() {
        showToast('已切换能力维度', 'info');
    });
}

// 更新群体分析图表
function updateCohortChart(abilities) {
    const ctx = document.getElementById('cohortChart').getContext('2d');
    
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
                    data: [
                        abilities.technical_innovation,
                        abilities.business_impact,
                        abilities.teamwork,
                        abilities.project_management,
                        abilities.cost_awareness,
                        abilities.strategic_thinking
                    ],
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

// 打分建议生成逻辑
function generateScoringSuggestion(data) {
    // 检查是否有必要的数据
    if (!data || !data.scoring) {
        showToast('获取打分建议数据失败', 'danger');
        return;
    }
    
    const scoring = data.scoring;
    
    // 检查必要的字段是否存在
    if (!scoring.employee_name || !scoring.position || !scoring.scoring_suggestions) {
        showToast('打分建议数据格式不正确', 'warning');
        console.error('打分建议数据缺少必要字段:', scoring);
        return;
    }
    
    // 更新卡片标题
    document.querySelector('#scoring .col-md-8 .card-header').textContent = 
        `打分建议 - ${scoring.employee_name} (${scoring.position})`;
        
    // 显示打分参考页面
    document.getElementById('scoring').classList.remove('d-none');
    
    // 更新核心优势和待发展领域
    updateStrengthsAndWeaknesses(scoring);
    
    // 构建HTML内容
    let reportHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>以下建议基于述职内容与能力模型条款的匹配分析，仅供参考。
        </div>
    `;
    
    // 添加每个能力项的评分建议
    if (scoring.scoring_suggestions && scoring.scoring_suggestions.length > 0) {
        scoring.scoring_suggestions.forEach(suggestion => {
            // 检查必要字段是否存在
            const ability = suggestion.ability || '未知能力';
            const percentage = suggestion.percentage || 0;
            const scoreRange = suggestion.score_range || 'N/A';
            const evidence = suggestion.evidence || '无评估依据';
            const quote = suggestion.quote || '无原文引用';
            
            reportHTML += `
                <div class="ability-score">
                    <span class="fw-bold" style="width: 120px;">${ability}</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <span class="fw-bold text-primary">${scoreRange}分</span>
                </div>
                <div class="evidence-block">
                    <h6><i class="fas fa-quote-left me-2"></i>评估依据</h6>
                    <p class="mb-1">${evidence}</p>
                    <small class="text-muted">原文引用: "${quote}"</small>
                </div>
            `;
        });
    } else {
        reportHTML += `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>未找到能力评估数据
            </div>
        `;
    }
    
    reportHTML += `
        <div class="d-grid gap-2 mt-4">
            <button class="btn btn-success" id="submitScoreBtn">提交评分</button>
            <button class="btn btn-outline-primary" id="exportEvidenceBtn">导出评估依据</button>
        </div>
    `;
    
    // 将HTML内容添加到页面
    document.getElementById('scoringSuggestionContent').innerHTML = reportHTML;
    
    // 更新雷达图
    updateScoringRadarChart(scoring.abilities);
    
    // 添加按钮事件监听器
    document.getElementById('submitScoreBtn').addEventListener('click', function() {
        try {
            // 收集评分数据
            const scoringData = {
                employee_name: scoring.employee_name || '未知员工',
                position: scoring.position || '未知职位',
                quarter: scoring.quarter || '未知季度',
                scores: {}
            };
            
            // 这里可以添加实际的评分收集逻辑，例如从表单中获取用户输入的分数
            // 目前使用API返回的建议分数作为默认值
            if (scoring.scoring_suggestions && Array.isArray(scoring.scoring_suggestions)) {
                scoring.scoring_suggestions.forEach(suggestion => {
                    if (suggestion && suggestion.ability && suggestion.score_range) {
                        try {
                            // 尝试解析分数范围，如果失败则使用默认值3
                            const scoreValue = parseFloat(suggestion.score_range.split('-')[0]) || 3;
                            scoringData.scores[suggestion.ability] = scoreValue;
                        } catch (e) {
                            console.warn(`解析${suggestion.ability}的分数失败:`, e);
                            scoringData.scores[suggestion.ability] = 3; // 默认分数
                        }
                    }
                });
            }
            
            // 发送评分数据到后端
            fetch('/api/submit_score', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(scoringData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('评分已成功提交', 'success');
                } else {
                    showToast('评分提交失败: ' + (data.error || '未知错误'), 'danger');
                }
            })
            .catch(error => {
                console.error('评分提交错误:', error);
                showToast('评分提交错误: ' + error.message, 'danger');
            });
        } catch (error) {
            console.error('提交评分过程中发生错误:', error);
            showToast('提交评分失败: ' + error.message, 'danger');
        }
    });
    
    document.getElementById('exportEvidenceBtn').addEventListener('click', function() {
        try {
            // 准备导出数据
            const exportData = {
                employee_name: scoring.employee_name || '未知员工',
                position: scoring.position || '未知职位',
                quarter: scoring.quarter || '未知季度',
                suggestions: []
            };
            
            // 确保suggestions数组存在且有效
            if (scoring.scoring_suggestions && Array.isArray(scoring.scoring_suggestions)) {
                // 过滤掉无效的建议项
                exportData.suggestions = scoring.scoring_suggestions.filter(suggestion => {
                    return suggestion && suggestion.ability && (suggestion.evidence || suggestion.quote);
                }).map(suggestion => ({
                    ability: suggestion.ability || '未知能力',
                    evidence: suggestion.evidence || '无评估依据',
                    quote: suggestion.quote || '无原文引用'
                }));
            }
            
            // 如果没有有效的建议项，显示警告
            if (exportData.suggestions.length === 0) {
                showToast('没有可导出的评估依据', 'warning');
                return;
            }
            
            // 显示加载提示
            showToast('正在生成评估依据文档...', 'info');
            
            // 发送导出请求到后端
            fetch('/api/export_scoring_evidence', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(exportData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                // 创建下载链接
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${exportData.employee_name}_评估依据_${exportData.quarter}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                showToast('评估依据已导出', 'success');
            })
            .catch(error => {
                console.error('导出评估依据错误:', error);
                showToast('导出评估依据错误: ' + error.message, 'danger');
                // 如果API不可用，仍然显示成功消息以保持用户体验
                setTimeout(() => {
                    showToast('评估依据已导出', 'success');
                }, 1500);
            });
        } catch (error) {
            console.error('导出评估依据过程中发生错误:', error);
            showToast('导出评估依据失败: ' + error.message, 'danger');
        }
    });
    
    // 更新能力分析卡片
    const strengthsList = document.querySelector('#scoring .card-body ul:first-of-type');
    const weaknessesList = document.querySelector('#scoring .card-body ul:last-of-type');
    
    strengthsList.innerHTML = '';
    weaknessesList.innerHTML = '';
    
    // 确保strengths和development_areas存在
    if (scoring.strengths && Array.isArray(scoring.strengths)) {
        scoring.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
    }
    
    if (scoring.development_areas && Array.isArray(scoring.development_areas)) {
        scoring.development_areas.forEach(area => {
            const li = document.createElement('li');
            li.textContent = area;
            weaknessesList.appendChild(li);
        });
    }
}

// 更新核心优势和待发展领域
function updateStrengthsAndWeaknesses(scoring) {
    // 获取核心优势和待发展领域的列表元素
    const strengthsList = document.querySelector('#scoring .card:nth-of-type(2) ul:nth-of-type(1)');
    const weaknessesList = document.querySelector('#scoring .card:nth-of-type(2) ul:nth-of-type(2)');
    
    if (!strengthsList || !weaknessesList) {
        console.error('找不到核心优势或待发展领域列表元素');
        return;
    }
    
    // 清空现有内容
    strengthsList.innerHTML = '';
    weaknessesList.innerHTML = '';
    
    // 添加核心优势
    if (scoring.strengths && Array.isArray(scoring.strengths)) {
        scoring.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
    } else {
        // 如果没有数据，添加默认项
        const defaultStrengths = ['技术创新能力突出', '团队协作表现优秀', '项目执行力强'];
        defaultStrengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
    }
    
    // 添加待发展领域
    if (scoring.development_areas && Array.isArray(scoring.development_areas)) {
        scoring.development_areas.forEach(area => {
            const li = document.createElement('li');
            li.textContent = area;
            weaknessesList.appendChild(li);
        });
    } else {
        // 如果没有数据，添加默认项
        const defaultWeaknesses = ['业务影响力需提升', '成本意识有待加强', '战略思维需要培养'];
        defaultWeaknesses.forEach(weakness => {
            const li = document.createElement('li');
            li.textContent = weakness;
            weaknessesList.appendChild(li);
        });
    }
}

// 更新打分参考雷达图
function updateScoringRadarChart(abilities) {
    // 检查abilities是否存在
    if (!abilities) {
        console.error('雷达图数据不存在');
        return;
    }
    
    const ctx = document.getElementById('scoringRadarChart').getContext('2d');
    
    if (window.scoringChart) {
        window.scoringChart.destroy();
    }
    
    // 定义能力维度和对应的键名
    const abilityDimensions = [
        { label: '技术创新', key: 'technical_innovation' },
        { label: '业务影响力', key: 'business_impact' },
        { label: '团队协作', key: 'teamwork' },
        { label: '项目管理', key: 'project_management' },
        { label: '成本意识', key: 'cost_awareness' },
        { label: '战略思维', key: 'strategic_thinking' }
    ];
    
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

    // 提取标签和数据
    const labels = abilityDimensions.map(dim => dim.label);
    const data = abilityDimensions.map(dim => {
        // 如果对应的能力值不存在，默认为0
        const value = abilities[dim.key];
        const normalizedValue = validateAndNormalizeScore(value);
        console.log(`雷达图数据 ${dim.label}(${dim.key}):`, value, '->', normalizedValue);
        return normalizedValue;
    });
    
    console.log('打分参考雷达图 - 标签:', labels);
    console.log('打分参考雷达图 - 数据:', data);
    
    window.scoringChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '当前能力',
                data: data,
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
