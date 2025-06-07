import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

# Путь к сервисному ключу
KEY_PATH = os.path.join(os.path.dirname(__file__), '../src/bazara-vpn-admin-firebase-adminsdk-fbsvc-603b4dd215.json')

if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def add_link(key, days, creator, base_url=None):
    doc = {
        'key': key,
        'created_at': datetime.utcnow().isoformat() + 'Z',
        'days': days,
        'creator': creator
    }
    if base_url:
        doc['base_url'] = base_url
    db.collection('links').add(doc)
    return True 