import json
import requests
from datetime import datetime
import os

FILENAME = 'expired_users.json'
LOGFILE = 'clean_expired.log'

def log(msg):
    with open(LOGFILE, 'a', encoding='utf-8') as f:
        f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | {msg}\n")
    print(msg)

def main():
    if not os.path.exists(FILENAME):
        log('Нет файла expired_users.json — нечего чистить.')
        return
    with open(FILENAME, 'r', encoding='utf-8') as f:
        users = json.load(f)
    keep = []
    for user in users:
        uuid = user['uuid']
        domain = user['domain']
        proxy_path = user['proxy_path']
        api_key = user['api_key']
        end_date = user['end_date']
        if datetime.now().date() < datetime.strptime(end_date, '%Y-%m-%d').date():
            keep.append(user)
            continue
        url = f"https://{domain}/{proxy_path}/api/v2/admin/user/{uuid}"
        headers = {"Hiddify-API-Key": api_key}
        try:
            resp = requests.delete(url, headers=headers, verify=False, timeout=15)
            if resp.status_code == 200:
                log(f"Удалён: {uuid} ({domain})")
            elif resp.status_code == 404:
                log(f"Не найден (404): {uuid} ({domain})")
            elif resp.status_code == 401:
                log(f"Ошибка авторизации (401): {uuid} ({domain})")
            else:
                log(f"Ошибка {resp.status_code} при удалении {uuid} ({domain}): {resp.text}")
                keep.append(user)
        except Exception as e:
            log(f"Исключение при удалении {uuid} ({domain}): {e}")
            keep.append(user)
    with open(FILENAME, 'w', encoding='utf-8') as f:
        json.dump(keep, f, ensure_ascii=False, indent=2)
    log('Чистка завершена.')

if __name__ == '__main__':
    main() 