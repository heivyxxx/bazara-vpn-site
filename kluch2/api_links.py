from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
import subprocess
import os

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002) 