from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
import subprocess
import os
from links_firebase import add_link
from datetime import datetime
import uuid

app = Flask(__name__)
KEY_PATH = os.path.join(os.path.dirname(__file__), '../src/bazara-vpn-admin-firebase-adminsdk-fbsvc-603b4dd215.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/api/links')
def get_links():
    docs = db.collection('links').stream()
    links = [doc.to_dict() for doc in docs]
    return jsonify({'links': links})

@app.route('/api/delete_link', methods=['POST'])
def delete_link():
    key = request.args.get('key')
    if not key:
        return jsonify({'error': 'no key'}), 400
    # Удаляем из Firestore
    try:
        docs = db.collection('links').where('key', '==', key).stream()
        for doc in docs:
            doc.reference.delete()
        # Вызываем удаление на сервере (kl2.py --delete <key>)
        try:
            result = subprocess.run(['python3', 'kl2.py', '--delete', key], timeout=20, capture_output=True, text=True)
            if result.returncode != 0:
                print(f'[ERROR] kl2.py --delete {key} stderr: {result.stderr}')
                return jsonify({'error': 'delete script failed', 'stderr': result.stderr}), 500
        except Exception as e:
            print(f'[ERROR] Exception in subprocess.run: {e}')
            return jsonify({'error': str(e)}), 500
        return jsonify({'status': 'ok'})
    except Exception as e:
        print(f'[ERROR] Exception in delete_link: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/trial', methods=['POST'])
def trial():
    data = request.get_json()
    telegram_id = str(data.get('telegram_id'))
    username = data.get('username', '')
    name = data.get('name', '')

    if not telegram_id:
        return jsonify({'success': False, 'error': 'No telegram_id'}), 400

    # Проверяем, выдавался ли trial этому Telegram ID
    trials = db.collection('trials').where('telegram_id', '==', telegram_id).stream()
    if any(trials):
        return jsonify({'success': False, 'error': 'Trial уже был выдан этому Telegram-аккаунту'}), 400

    # Генерируем уникальный ключ для trial-ссылки
    task_id = str(uuid.uuid4())
    filename = f"{task_id}.txt"

    # Генерируем ссылку через subprocess (days=3)
    try:
        result = subprocess.run(
            ['python3', 'kl2.py', '--generate', task_id, '3'],
            cwd=os.path.dirname(__file__),
            timeout=60,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            print(f'[ERROR] kl2.py --generate {task_id} 3 stderr: {result.stderr}')
            return jsonify({'success': False, 'error': 'Ошибка генерации trial-ссылки'}), 500
    except Exception as e:
        print(f'[ERROR] Exception in subprocess.run: {e}')
        return jsonify({'success': False, 'error': str(e)}), 500

    # Ссылка для пользователя
    link = f"https://kluch2.vercel.app/{filename}"

    # Сохраняем trial в Firestore
    db.collection('trials').add({
        'telegram_id': telegram_id,
        'username': username,
        'name': name,
        'task_id': task_id,
        'link': link,
        'created_at': datetime.utcnow().isoformat() + 'Z'
    })

    # Сохраняем ссылку в links (чтобы она работала 3 дня)
    add_link(task_id, 3, creator=telegram_id)

    return jsonify({'success': True, 'link': link})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002) 