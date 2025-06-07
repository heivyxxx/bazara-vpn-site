from flask import Flask, jsonify, request
import subprocess
import json as _json

app = Flask(__name__)

@app.route('/clean_expired', methods=['POST'])
def clean_expired():
    try:
        # Запускаем clean_expired.py как отдельный процесс
        result = subprocess.run(['python3', 'clean_expired.py'], capture_output=True, text=True)
        if result.returncode == 0:
            # Пытаемся найти json с removed
            removed = None
            try:
                out = result.stdout.strip().split('\n')
                for line in reversed(out):
                    if line.strip().startswith('{'):
                        data = _json.loads(line.strip())
                        if 'removed' in data:
                            removed = data['removed']
                            break
            except Exception:
                pass
            resp = {'status': 'ok', 'output': result.stdout}
            if removed is not None:
                resp['removed'] = removed
            return jsonify(resp)
        else:
            return jsonify({'status': 'error', 'output': result.stderr}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001) 