from flask import Flask, jsonify
import subprocess
import re

app = Flask(__name__)

@app.route('/generate', methods=['GET'])
def generate():
    try:
        process = subprocess.Popen(
            ['python', 'kl2.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8'
        )

        full_output = ''
        for line in process.stdout:
            full_output += line
            print(line.strip())  # вывод в консоль для отладки

        process.wait()

        # ищем ссылку в выводе
        match = re.search(r'https://.+?\.txt', full_output)
        if match:
            return jsonify({'link': match.group(0)})
        else:
            return jsonify({
                'error': '❌ Ссылка не найдена в выводе скрипта.',
                'output': full_output
            }), 500

    except Exception as e:
        return jsonify({'error': f'🚫 Ошибка выполнения: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)
