from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    if not data or 'task_id' not in data:
        return jsonify({'error': 'task_id required'}), 400
    task_id = data['task_id']
    tokens_by_task_path = 'tokens_by_task.json'
    try:
        with open(tokens_by_task_path, 'r', encoding='utf-8') as f:
            tokens_by_task = json.load(f)
    except Exception:
        tokens_by_task = {}
    if task_id in tokens_by_task:
        return jsonify({'status': 'ok'})
    filename = f'{task_id}.txt'
    filepath = f'/root/kluch2/public/{filename}'
    # Запускаем генерацию через kl2.py
    subprocess.run(['python3', '/root/kluch2/kl2.py', task_id])
    if not os.path.exists(filepath):
        return jsonify({'error': 'Файл не создан'}), 500
    token = task_id
    tokens_by_task[task_id] = token
    with open(tokens_by_task_path, 'w', encoding='utf-8') as f:
        json.dump(tokens_by_task, f, ensure_ascii=False, indent=2)
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)
