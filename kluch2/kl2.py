import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import requests
import base64
import urllib3
import uuid
import os
os.environ["PATH"] += r";C:\\Users\\Admin\\AppData\\Roaming\\npm"
import tempfile
import subprocess
import datetime
import shutil
import time
import glob
import json
from datetime import datetime, timedelta
import re
import random
import string
import smtplib
from email.mime.text import MIMEText
# Импорт для Firestore
from links_firebase import add_link

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

print('PATH:', os.environ["PATH"])

SERVERS = [
    # Удалён: {
    #     "country": "🇱🇹 Литва #1",
    #     "domain": "vpnbazara.ru",
    #     "api_url": "https://vpnbazara.ru/kmSdgvmDQSXB/api/v2/admin/user",
    #     "api_key": "fe8140e9-02a7-4790-8c22-30aac9647fd4",
    #     "ws_path": "/kmSdgvmDQSXB"
    # },
    {
        "country": "🇱🇹 Литва #2",
        "domain": "vpn.bazaravpn.ru",
        "api_url": "https://vpn.bazaravpn.ru/x5do6FZ5R1Cz3m6vyONSpMCWKPuUD/api/v2/admin/user",
        "api_key": "6c2400c0-918c-4a9f-8a59-9df23838e4e6",
        "ws_path": "/gnLVPbCy2DikjbnpLXaz"
    },
    {
        "country": "🇩🇪 Германия",
        "domain": "germany.bazaravpn.ru",
        "api_url": "https://germany.bazaravpn.ru/JdbX7yhT37znZZ/api/v2/admin/user",
        "api_key": "27bc6d11-a699-4360-811c-260c3c0b37d3",
        "ws_path": "/JdbX7yhT37znZZ"
    },
    {
        "country": "🇹🇷 Турция",
        "domain": "turkey.bazaravpn.ru",
        "api_url": "https://turkey.bazaravpn.ru/yYEIuX3jX61MXzSQhSsY4/api/v2/admin/user",
        "api_key": "65478704-ac79-4636-a036-892e5aa65584",
        "ws_path": "/yYEIuX3jX61MXzSQhSsY4"
    },
    {
        "country": "🇯🇵 Япония",
        "domain": "japan.bazaravpn.ru",
        "api_url": "https://japan.bazaravpn.ru/fZ7s2sPOFD8NyUrv/api/v2/admin/user",
        "api_key": "fabcc56a-f2db-4d15-ac14-6d4b7d2f691f",
        "ws_path": "/fZ7s2sPOFD8NyUrv"
    },
    {
        "country": "🇳🇱 Нидерланды",
        "domain": "amsterdam.bazaravpn.ru",
        "api_url": "https://amsterdam.bazaravpn.ru/NGtiWweDZOri3gilZ8C7Rdcq/api/v2/admin/user",
        "api_key": "3391f3ff-6675-4076-8927-e75e1ac3b5e2",
        "ws_path": "/NGtiWweDZOri3gilZ8C7Rdcq"
    },
    {
        "country": "🇺🇸 США",
        "domain": "usa.bazaravpn.ru",
        "api_url": "https://usa.bazaravpn.ru/DKtwf29IZL72EISGNode/api/v2/admin/user",
        "api_key": "b21ba2e8-e5e9-48b5-9d21-846feae0ac48",
        "ws_path": "/DKtwf29IZL72EISGNode"
    },
    {
        "country": "🇿🇦 ЮАР",
        "domain": "afrika.bazaravpn.ru",
        "api_url": "https://afrika.bazaravpn.ru/roEf5khbBY2ufxS/api/v2/admin/user",
        "api_key": "ebe672ba-936a-4b84-b45a-9825295e9f87",
        "ws_path": "/roEf5khbBY2ufxS"
    },
    # --- Фейковые страны ---
    {
        # Канада (копия США)
        "country": "🇨🇦 Канада",
        "domain": "usa.bazaravpn.ru",
        "api_url": "https://usa.bazaravpn.ru/DKtwf29IZL72EISGNode/api/v2/admin/user",
        "api_key": "b21ba2e8-e5e9-48b5-9d21-846feae0ac48",
        "ws_path": "/DKtwf29IZL72EISGNode",
        "fake_label": True
    },
    {
        # Австралия (копия Японии)
        "country": "🇦🇺 Австралия",
        "domain": "japan.bazaravpn.ru",
        "api_url": "https://japan.bazaravpn.ru/fZ7s2sPOFD8NyUrv/api/v2/admin/user",
        "api_key": "fabcc56a-f2db-4d15-ac14-6d4b7d2f691f",
        "ws_path": "/fZ7s2sPOFD8NyUrv",
        "fake_label": True
    },
    {
        # Сингапур (копия Турции)
        "country": "🇸🇬 Сингапур",
        "domain": "turkey.bazaravpn.ru",
        "api_url": "https://turkey.bazaravpn.ru/yYEIuX3jX61MXzSQhSsY4/api/v2/admin/user",
        "api_key": "65478704-ac79-4636-a036-892e5aa65584",
        "ws_path": "/yYEIuX3jX61MXzSQhSsY4",
        "fake_label": True
    },
    {
        # Швейцария (копия Амстердама)
        "country": "🇨🇭 Швейцария",
        "domain": "amsterdam.bazaravpn.ru",
        "api_url": "https://amsterdam.bazaravpn.ru/NGtiWweDZOri3gilZ8C7Rdcq/api/v2/admin/user",
        "api_key": "3391f3ff-6675-4076-8927-e75e1ac3b5e2",
        "ws_path": "/NGtiWweDZOri3gilZ8C7Rdcq",
        "fake_label": True
    },
    {
        "country": "🇵🇱 Польша",
        "domain": "poland.bazaravpn.ru",
        "api_url": "https://poland.bazaravpn.ru/sFDcLaHpTJHrrXP/api/v2/admin/user",
        "api_key": "c26d79e8-5a2d-456c-9d8c-df92e6a1fa1b",
        "ws_path": "/4SR1sPhbB1cQJqa5sJ"
    },
    {
        "country": "🇰🇿 Казахстан",
        "domain": "kazah.bazaravpn.ru",
        "api_url": "https://kazah.bazaravpn.ru/eS3Egs1z4Da/api/v2/admin/user",
        "api_key": "291064fa-4941-4599-9bfe-36c74e10789e",
        "ws_path": "/eS3Egs1z4Da"
    },
    {
        "country": "🇧🇷 Бразилия",
        "domain": "brazil.bazaravpn.ru",
        "api_url": "https://brazil.bazaravpn.ru/KhfCAkVAdjmdoVEjla9cJ/api/v2/admin/user",
        "api_key": "acd95152-5874-436f-9b52-943fdb77dff3",
        "ws_path": "/KhfCAkVAdjmdoVEjla9cJ"
    },
    {
        "country": "🇲🇾 Малайзия",
        "domain": "malaysia2.bazaravpn.ru",
        "api_url": "https://malaysia2.bazaravpn.ru/nkwYBkfoWniPvOE/api/v2/admin/user",
        "api_key": "1fcc5a62-6b07-4b8a-b6fe-21212a0343fb",
        "ws_path": "/nkwYBkfoWniPvOE"
    },
    {
        "country": "🇳🇬 Нигерия",
        "domain": "nigeria.bazaravpn.ru",
        "api_url": "https://nigeria.bazaravpn.ru/cvJwkPpvpC9sBLOp24LR9Or/api/v2/admin/user",
        "api_key": "d5868e9d-42b6-4a04-b94d-fa0109f18d65",
        "ws_path": "/cvJwkPpvpC9sBLOp24LR9Or"
    },
]

# --- Жёстко заданные path для каждого домена ---
domain_to_path = {
    "usa.bazaravpn.ru": "/pHOAahnoXZ8U7dpDv",
    "afrika.bazaravpn.ru": "/81XyrQfP5tmxpT75iJ",
    "amsterdam.bazaravpn.ru": "/fUZstfR0z4GS3bPZvQF4",
    "japan.bazaravpn.ru": "/nUGfbFw3qsscocDNKjt9owA0",
    "turkey.bazaravpn.ru": "/6FTErvA5R7tSIA6nFROFRR3xu",
    "germany.bazaravpn.ru": "/O6a0Zmu4qEpqtURGQK",
    "vpn.bazaravpn.ru": "/gnLVPbCy2DikjbnpLXaz",
    "vpnbazara.ru": "/CAzwEAqWgatnlXcZ4w",
    "poland.bazaravpn.ru": "/4SR1sPhbB1cQJqa5sJ",
    "kazah.bazaravpn.ru": "/uGfehTZQvDsM8rFQPds",
    "brazil.bazaravpn.ru": "/7TOOalXqIxw0mLkDYKuzV",
    "malaysia2.bazaravpn.ru": "/UNLncJhBzujAalD4HWM",
    "nigeria.bazaravpn.ru": "/0kEjCdsKfaVf3SfxAVhD",
}

# --- Название подписки для Hiddify ---
subscription_name = '🛡️ BazaraVPN Premium'

# --- Фейковые ноды и реклама ---
def make_fake_vless(real_vless, new_label):
    # Меняем одну букву в path (например, первую букву на X)
    def repl(m):
        path = m.group(1)
        if len(path) > 1:
            return 'path=' + 'X' + path[1:]
        return 'path=' + path
    fake = re.sub(r'path=([^&]+)', repl, real_vless)
    # Меняем label
    fake = re.sub(r'#.*$', f'#{new_label}', fake)
    return fake

def is_valid_vless(line):
    if not line.startswith("vless://"):
        return False
    if line.startswith("vless://fake@"):
        return False
    m = re.match(r"vless://([0-9a-fA-F-]{36})@", line)
    if not m:
        return False
    return True

def add_user_to_expired(uuid, domain, proxy_path, api_key, filename, days=30):
    expired_filename = "expired_users.json"
    end_date = (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")
    entry = {
        "uuid": uuid,
        "domain": domain,
        "proxy_path": proxy_path,
        "api_key": api_key,
        "end_date": end_date,
        "filename": filename
    }
    try:
        with open(expired_filename, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        data = []
    data.append(entry)
    with open(expired_filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[INFO] Добавлен в expired_users.json: {entry}")

def generate_config_for_filename(filename):
    print(f"[INFO] Генерация конфига для файла: {filename}")
    vless_links = []
    uuid_map = {}
    # --- Генерация пользователей и ссылок ---
    for idx, server in enumerate(SERVERS):
        if server.get("fake_label"):
            if server["country"] == "🇨🇦 Канада":
                orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇺🇸 США"][0]
            elif server["country"] == "🇦🇺 Австралия":
                orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇯🇵 Япония"][0]
            elif server["country"] == "🇸🇬 Сингапур":
                orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇹🇷 Турция"][0]
            elif server["country"] == "🇨🇭 Швейцария":
                orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇳🇱 Нидерланды"][0]
            else:
                continue
            new_uuid = uuid_map.get(orig_idx)
            if not new_uuid:
                continue
            orig_domain = SERVERS[orig_idx]["domain"]
            path = domain_to_path.get(orig_domain, SERVERS[orig_idx]["ws_path"])
        else:
            user_data = {
                "name": "AutoUser",
                "package_days": 30,
                "usage_limit_GB": 1000
            }
            headers = {
                "Hiddify-API-Key": server["api_key"],
                "Content-Type": "application/json"
            }
            uuid = None
            for attempt in range(1, 4):
                try:
                    resp = requests.post(server["api_url"], headers=headers, json=user_data, verify=False)
                    if resp.status_code == 200:
                        data = resp.json()
                        uuid = data.get("uuid")
                        if uuid:
                            print(f"✅ Юзер создан на {server['country']} (попытка {attempt})! UUID: {uuid}")
                            proxy_path = server['api_url'].split('/')[3]
                            add_user_to_expired(uuid, server['domain'], proxy_path, server['api_key'], filename, days=user_data["package_days"])
                            break
                        else:
                            print(f"❌ Нет uuid в ответе от {server['country']} (попытка {attempt})! Жду 30 сек...")
                    else:
                        print(f"❌ Ошибка при создании на {server['country']} (попытка {attempt}): {resp.status_code} → {resp.text}. Жду 30 сек...")
                except Exception as e:
                    print(f"❌ Ошибка подключения к {server['country']} (попытка {attempt}): {e}. Жду 30 сек...")
                if attempt < 3:
                    time.sleep(30)
            if not uuid:
                print(f"❌ Не удалось создать юзера на {server['country']} после 3 попыток. Пропускаю...")
                continue
        domain = server["domain"]
        path = domain_to_path.get(domain, server["ws_path"])
        vless_url = (
            f"vless://{uuid}@{domain}:443"
            f"?hiddify=1&sni={domain}&type=ws&alpn=http/1.1"
            f"&path={path}&host={domain}"
            f"&encryption=none&fp=chrome&headerType=None&security=tls"
            f"#{server['country']}"
        )
        vless_links.append(vless_url)

    # --- Фейковые ноды и реклама ---
    fake_labels = [
        '❌ Turkey 2 UNAVAILABLE ❌',
        '📅 20 июня 2025',
        '⚡ @BazaraVPN Новости',
    ]
    fake_nodes = []
    for i, label in enumerate(fake_labels):
        if vless_links:
            fake_nodes.append(make_fake_vless(vless_links[i % len(vless_links)], label))

    subscription_name = filename[:-4]
    all_lines = [subscription_name] + vless_links + fake_nodes
    filtered_lines = []
    for line in all_lines:
        l = line.strip()
        if not l or is_valid_vless(l):
            filtered_lines.append(line)
        else:
            if not l.startswith("#"):
                filtered_lines.append("#" + line)
            else:
                filtered_lines.append(line)
    all_links = '\n'.join(filtered_lines)
    b64 = base64.b64encode(all_links.encode()).decode()
    # Путь для сохранения файла
    output_dir = os.path.join(os.path.dirname(__file__), "public")
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(b64)
    print(f"✅ base64 сохранён в {filepath}")
    print(f"🔗 Ссылка для пользователя: https://kluch2.vercel.app/{filename}")

    # --- Сохраняем информацию о токене в tokens.json ---
    tokens_path = "tokens.json"
    token = filename[:-4]  # теперь токен = task_id
    created = datetime.now().isoformat()
    token_entry = {"token": token, "filename": filename, "created": created}
    try:
        with open(tokens_path, "r", encoding="utf-8") as f:
            tokens = json.load(f)
    except Exception:
        tokens = []
    tokens.append(token_entry)
    with open(tokens_path, "w", encoding="utf-8") as f:
        json.dump(tokens, f, ensure_ascii=False, indent=2)
    print(f"[INFO] Запись о токене добавлена в {tokens_path}: {token_entry}")

    # --- Ждём, чтобы файл точно успел появиться ---
    time.sleep(3)

    # --- Автоудаление base64_*.txt старше 30 дней ---
    now = time.time()
    for filepath in glob.glob(os.path.join(output_dir, "base64_*.txt")):
        if now - os.path.getmtime(filepath) > 30*24*60*60:
            try:
                os.remove(filepath)
                print(f"✅ Удалён старый файл: {filepath}")
            except Exception as e:
                print(f"⚠️ Не удалось удалить {filepath}: {e}")

    # После генерации — пишем в Firestore
    base_url = 'https://vpn.bazara.app/vless/'
    add_link(task_id, days, creator, base_url=base_url)

    return filename, token

# Функция для отправки письма через SMTP Brevo
def send_vpn_link(email, link):
    smtp_server = "smtp-relay.brevo.com"
    port = 587
    login = "8ed0d1001@smtp-brevo.com"
    password = "XzkLHcYGvqgQtKZJ"
    sender = login
    subject = "Ваша ссылка на BazaraVPN"
    body = f"Здравствуйте!\n\nВаша ссылка для подключения к VPN: {link}\n\nСпасибо за покупку!"
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = email
    try:
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()
            server.login(login, password)
            server.sendmail(sender, [email], msg.as_string())
        print(f"[INFO] Письмо отправлено на {email}")
    except Exception as e:
        print(f"[ERROR] Не удалось отправить письмо на {email}: {e}")

if __name__ == '__main__':
    import sys
    import json as _json
    # --- Удаление ссылки и пользователей по ключу ---
    if len(sys.argv) > 2 and sys.argv[1] == '--delete':
        key = sys.argv[2]
        filename = f'{key}.txt'
        # 1. Удаляем файл
        output_dir = os.path.join(os.path.dirname(__file__), "public")
        file_path = os.path.join(output_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f'[INFO] Файл {file_path} удалён')
        # 2. Удаляем пользователей из expired_users.json и с серверов
        try:
            with open('expired_users.json', 'r', encoding='utf-8') as f:
                users = json.load(f)
        except Exception:
            users = []
        keep = []
        for user in users:
            if user.get('filename') == filename:
                # Пробуем удалить пользователя с сервера
                uuid = user['uuid']
                domain = user['domain']
                proxy_path = user['proxy_path']
                api_key = user['api_key']
                url = f'https://{domain}/{proxy_path}/api/v2/admin/user/{uuid}'
                headers = {"Hiddify-API-Key": api_key}
                try:
                    resp = requests.delete(url, headers=headers, verify=False, timeout=15)
                    print(f'[INFO] Удалён пользователь {uuid} ({domain}): {resp.status_code}')
                except Exception as e:
                    print(f'[WARN] Не удалось удалить пользователя {uuid} ({domain}): {e}')
            else:
                keep.append(user)
        with open('expired_users.json', 'w', encoding='utf-8') as f:
            json.dump(keep, f, ensure_ascii=False, indent=2)
        print('[INFO] expired_users.json обновлён')
        sys.exit(0)
    task_id = sys.argv[1]
    package_days = 30
    creator = 'user'
    if len(sys.argv) > 3 and sys.argv[3] == 'admin':
        creator = 'admin'
    # 1. Пробуем взять из аргументов
    if len(sys.argv) > 2:
        try:
            package_days = int(sys.argv[2])
        except Exception:
            pass
    # 2. Пробуем взять из stdin (json)
    user_email = None
    try:
        if not sys.stdin.isatty():
            data = sys.stdin.read()
            if data.strip():
                obj = _json.loads(data)
                if 'package_days' in obj:
                    package_days = int(obj['package_days'])
                if 'creator' in obj:
                    creator = obj['creator']
                if 'email' in obj:
                    user_email = obj['email']
    except Exception:
        pass
    filename = f'{task_id}.txt'
    # Передаём package_days в генератор
    def generate_config_for_filename_with_days(filename, days, output_dir=None):
        if output_dir is None:
            output_dir = os.path.join(os.path.dirname(__file__), "public")
        orig_generate = generate_config_for_filename
        def patched_generate(filename):
            vless_links = []
            uuid_map = {}
            for idx, server in enumerate(SERVERS):
                if server.get("fake_label"):
                    if server["country"] == "🇨🇦 Канада":
                        orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇺🇸 США"][0]
                    elif server["country"] == "🇦🇺 Австралия":
                        orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇯🇵 Япония"][0]
                    elif server["country"] == "🇸🇬 Сингапур":
                        orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇹🇷 Турция"][0]
                    elif server["country"] == "🇨🇭 Швейцария":
                        orig_idx = [i for i, s in enumerate(SERVERS) if s["country"] == "🇳🇱 Нидерланды"][0]
                    else:
                        continue
                    new_uuid = uuid_map.get(orig_idx)
                    if not new_uuid:
                        continue
                    orig_domain = SERVERS[orig_idx]["domain"]
                    path = domain_to_path.get(orig_domain, SERVERS[orig_idx]["ws_path"])
                else:
                    user_data = {
                        "name": "AutoUser",
                        "package_days": days,
                        "usage_limit_GB": 1000
                    }
                    headers = {
                        "Hiddify-API-Key": server["api_key"],
                        "Content-Type": "application/json"
                    }
                    uuid = None
                    for attempt in range(1, 4):
                        try:
                            resp = requests.post(server["api_url"], headers=headers, json=user_data, verify=False)
                            if resp.status_code == 200:
                                data = resp.json()
                                uuid = data.get("uuid")
                                if uuid:
                                    print(f"✅ Юзер создан на {server['country']} (попытка {attempt})! UUID: {uuid}")
                                    proxy_path = server['api_url'].split('/')[3]
                                    add_user_to_expired(uuid, server['domain'], proxy_path, server['api_key'], filename, days=user_data["package_days"])
                                    break
                                else:
                                    print(f"❌ Нет uuid в ответе от {server['country']} (попытка {attempt})! Жду 30 сек...")
                            else:
                                print(f"❌ Ошибка при создании на {server['country']} (попытка {attempt}): {resp.status_code} → {resp.text}. Жду 30 сек...")
                        except Exception as e:
                            print(f"❌ Ошибка подключения к {server['country']} (попытка {attempt}): {e}. Жду 30 сек...")
                        if attempt < 3:
                            time.sleep(30)
                    if not uuid:
                        print(f"❌ Не удалось создать юзера на {server['country']} после 3 попыток. Пропускаю...")
                        continue
                domain = server["domain"]
                path = domain_to_path.get(domain, server["ws_path"])
                vless_url = (
                    f"vless://{uuid}@{domain}:443"
                    f"?hiddify=1&sni={domain}&type=ws&alpn=http/1.1"
                    f"&path={path}&host={domain}"
                    f"&encryption=none&fp=chrome&headerType=None&security=tls"
                    f"#{server['country']}"
                )
                vless_links.append(vless_url)
            # --- Фейковые ноды и реклама ---
            fake_labels = [
                '❌ Turkey 2 UNAVAILABLE ❌',
                '📅 20 июня 2025',
                '⚡ @BazaraVPN Новости',
            ]
            fake_nodes = []
            for i, label in enumerate(fake_labels):
                if vless_links:
                    fake_nodes.append(make_fake_vless(vless_links[i % len(vless_links)], label))
            subscription_name = filename[:-4]
            all_lines = [subscription_name] + vless_links + fake_nodes
            filtered_lines = []
            for line in all_lines:
                l = line.strip()
                if not l or is_valid_vless(l):
                    filtered_lines.append(line)
                else:
                    if not l.startswith("#"):
                        filtered_lines.append("#" + line)
                    else:
                        filtered_lines.append(line)
            all_links = '\n'.join(filtered_lines)
            b64 = base64.b64encode(all_links.encode()).decode()
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(b64)
            print(f"✅ base64 сохранён в {filepath}")
            print(f"🔗 Ссылка для пользователя: https://kluch2.vercel.app/{filename}")
            # --- Сохраняем информацию о токене в tokens.json ---
            tokens_path = "tokens.json"
            token = filename[:-4]  # теперь токен = task_id
            created = datetime.now().isoformat()
            token_entry = {"token": token, "filename": filename, "created": created}
            try:
                with open(tokens_path, "r", encoding="utf-8") as f:
                    tokens = json.load(f)
            except Exception:
                tokens = []
            tokens.append(token_entry)
            with open(tokens_path, "w", encoding="utf-8") as f:
                json.dump(tokens, f, ensure_ascii=False, indent=2)
            print(f"[INFO] Запись о токене добавлена в {tokens_path}: {token_entry}")
            time.sleep(3)
            now = time.time()
            for filepath in glob.glob(os.path.join(output_dir, "base64_*.txt")):
                if now - os.path.getmtime(filepath) > 30*24*60*60:
                    try:
                        os.remove(filepath)
                        print(f"✅ Удалён старый файл: {filepath}")
                    except Exception as e:
                        print(f"⚠️ Не удалось удалить {filepath}: {e}")
            result = filename, token
            # После генерации — пишем в Firestore
            base_url = 'https://vpn.bazara.app/vless/'
            add_link(task_id, days, creator, base_url=base_url)
            return result
        return patched_generate(filename)
    result = generate_config_for_filename_with_days(filename, package_days)
    # После генерации отправляем письмо, если email есть
    if 'user_email' in locals() and user_email:
        link_url = f"https://kluch2.vercel.app/{filename}"
        send_vpn_link(user_email, link_url)
