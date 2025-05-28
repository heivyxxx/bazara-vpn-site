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

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

print('PATH:', os.environ["PATH"])

SERVERS = [
    {
        "country": "🇱🇹 Литва #1",
        "domain": "vpnbazara.ru",
        "api_url": "https://vpnbazara.ru/kmSdgvmDQSXB/api/v2/admin/user",
        "api_key": "fe8140e9-02a7-4790-8c22-30aac9647fd4",
        "ws_path": "/kmSdgvmDQSXB"
    },
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

# --- Генерация VLESS-ссылок ---
vless_links = []
uuid_map = {}

# --- Функция для добавления пользователя в expired_users.json ---
def add_user_to_expired(uuid, domain, proxy_path, api_key):
    filename = 'expired_users.json'
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            users = json.load(f)
    except Exception:
        users = []
    end_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    users.append({
        'uuid': uuid,
        'domain': domain,
        'proxy_path': proxy_path,
        'api_key': api_key,
        'end_date': end_date
    })
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

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
        new_uuid = str(uuid.uuid4())
        uuid_map[idx] = new_uuid
        user_data = {
            "name": "AutoUser",
            "uuid": new_uuid,
            "package_days": 30,
            "usage_limit_GB": 1000
        }
        headers = {
            "Hiddify-API-Key": server["api_key"],
            "Content-Type": "application/json"
        }
        try:
            resp = requests.post(server["api_url"], headers=headers, json=user_data, verify=False)
            if resp.status_code == 200:
                print(f"✅ Юзер создан на {server['country']} ({server['domain']})! UUID: {new_uuid}")
                # Добавляем в трекинг-файл
                proxy_path = server['api_url'].split('/')[3]
                add_user_to_expired(new_uuid, server['domain'], proxy_path, server['api_key'])
            else:
                print(f"❌ Ошибка при создании на {server['country']} ({server['domain']}): {resp.status_code} → {resp.text}")
                continue
        except Exception as e:
            print(f"❌ Ошибка подключения к {server['country']} ({server['domain']}): {e}")
            continue
    domain = server["domain"]
    path = domain_to_path.get(domain, server["ws_path"])
    vless_url = (
        f"vless://{new_uuid}@{domain}:443"
        f"?hiddify=1&sni={domain}&type=ws&alpn=http/1.1"
        f"&path={path}&host={domain}"
        f"&encryption=none&fp=chrome&headerType=None&security=tls"
        f"#{server['country']} {domain}"
    )
    vless_links.append(vless_url)

# --- Генерация красивого имени файла ---
def get_next_filename():
    base = "BazaraVPN 1M-"
    folder = "public"
    nums = []
    for fname in os.listdir(folder):
        if fname.startswith(base) and fname.endswith(".txt"):
            try:
                n = int(fname[len(base):-4])
                nums.append(n)
            except Exception:
                pass
    next_num = max(nums) + 1 if nums else 1
    return f"{base}{next_num}.txt"

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

def is_valid_vless(line):
    if not line.startswith("vless://"):
        return False
    if line.startswith("vless://fake@"):
        return False
    m = re.match(r"vless://([0-9a-fA-F-]{36})@", line)
    if not m:
        return False
    return True

if vless_links:
    filename = get_next_filename()
    subscription_name = filename[:-4]  # без .txt
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
    print(f"\n🌐 Все VLESS-ссылки для {filename}:")
    print(all_links)
    print("\n📦 Base64 всех ссылок:")
    print(b64)
    # --- Сохраняем файл с этим именем ---
    with open(os.path.join("public", filename), "w", encoding="utf-8") as f:
        f.write(b64)
    print(f"✅ base64 сохранён в public/{filename}")
    print(f"🔗 Ссылка для пользователя: https://kluch2.vercel.app/{filename}")
    # --- Ждём, чтобы файл точно успел появиться ---
    time.sleep(3)
    # --- Автодеплой на Vercel в один и тот же проект ---
    vercel_path = r"C:\\Users\\Admin\\AppData\\Roaming\\npm\\vercel.cmd"
    project_name = "kluch2"  # фиксированное имя проекта
    try:
        result = subprocess.run([
            vercel_path, "--prod", "--yes", "--confirm", "--name", project_name, "."
        ], capture_output=True, text=True, check=True)
        url = None
        for line in result.stdout.splitlines():
            if line.startswith("https://") and ".vercel.app" in line:
                url = line.strip()
                break
        if url:
            print("\n✅ Залив на Vercel завершён!")
            print(f"🔗 Ссылка на деплой: {url}/{filename}")
            # --- Проверка сгенерированной ссылки на base64-файл ---
            def check_base64_url(url):
                try:
                    resp = requests.get(url)
                    if resp.status_code == 401:
                        print('❌ Ошибка 401: доступ запрещён')
                        return False
                    if 'text/plain' not in resp.headers.get('content-type', ''):
                        print(f'❌ Не тот формат: content-type = {resp.headers.get("content-type", "")}')
                        return False
                    if any(tag in resp.text.lower() for tag in ['<html', '<head', '<body', '<div', '<span', '<script']):
                        print('❌ В теле HTML, а не base64')
                        return False
                    if not re.fullmatch(r'[A-Za-z0-9+/=\n\r]+', resp.text) or len(resp.text) < 100:
                        print('❌ Похоже, это не base64 или слишком коротко')
                        return False
                    print('✅ Всё заебок, ссылка подходит для Hiddify!')
                    print('Первые 100 символов base64:')
                    print(resp.text[:100])
                    return True
                except Exception as e:
                    print('❌ Ошибка запроса:', e)
                    return False

            # Проверяем ссылку после деплоя
            if url:
                check_base64_url(f"{url}/{filename}")
        else:
            print("❌ Не удалось получить ссылку Vercel из вывода:")
            print(result.stdout)
    except Exception as e:
        print(f"❌ Ошибка деплоя на Vercel: {e}")

    # --- Автоудаление base64_*.txt старше 30 дней ---
    now = time.time()
    for filepath in glob.glob(os.path.join("public", "base64_*.txt")):
        if now - os.path.getmtime(filepath) > 30*24*60*60:
            try:
                os.remove(filepath)
                print(f"✅ Удалён старый файл: {filepath}")
            except Exception as e:
                print(f"⚠️ Не удалось удалить {filepath}: {e}")
else:
    print("❌ Не удалось создать ни одного пользователя!")
