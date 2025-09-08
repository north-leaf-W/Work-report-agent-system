"""
智能述职Agent系统 - 主应用入口
模块化架构，分离三大功能版块：
1. 述职人入口 (reporter) - 文档解析、校对
2. BP入口 (bp_manager) - 员工诊断、群体分析  
3. 评委入口 (evaluator) - 打分建议
"""
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import sys
import json
import uuid
import time
import logging
import traceback
import dashscope
from werkzeug.utils import secure_filename

# 导入模块化的蓝图
from modules.config import UPLOAD_FOLDER, API_KEY_MANAGER
from modules.reporter import reporter_bp
from modules.bp_manager import bp_manager_bp 
from modules.evaluator import evaluator_bp

# 初始化Flask应用
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

# API密钥管理器会自动设置DashScope API密钥

# 注册蓝图
app.register_blueprint(reporter_bp)
app.register_blueprint(bp_manager_bp)
app.register_blueprint(evaluator_bp)

@app.route('/')
def index():
    """主页面"""
    return render_template('index.html')

@app.route('/api/config/status', methods=['GET'])
def get_config_status():
    """获取API配置状态"""
    try:
        return jsonify({
            'success': True,
            'configured': API_KEY_MANAGER.is_configured(),
            'current_key': API_KEY_MANAGER.get_current_key()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/config/validate', methods=['POST'])
def validate_api_key():
    """验证API密钥"""
    try:
        data = request.get_json()
        api_key = data.get('api_key', '').strip()
        
        if not api_key:
            return jsonify({
                'success': False,
                'error': 'API密钥不能为空'
            }), 400
            
        validation_result = API_KEY_MANAGER.validate_api_key(api_key)
        return jsonify({
            'success': True,
            'validation': validation_result
        })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/config/set', methods=['POST'])
def set_api_key():
    """设置API密钥"""
    try:
        data = request.get_json()
        api_key = data.get('api_key', '').strip()
        
        if not api_key:
            return jsonify({
                'success': False,
                'error': 'API密钥不能为空'
            }), 400
            
        result = API_KEY_MANAGER.set_api_key(api_key)
        return jsonify(result)
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/static/<path:path>')
def serve_static(path):
    """静态文件服务"""
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)