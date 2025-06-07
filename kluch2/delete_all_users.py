import os
import requests
import json
import shutil
import time
from datetime import datetime

# --- Копируем SERVERS из kl2.py ---
SERVERS = [
    {"country": "🇱🇹 Литва #2", "domain": "vpn.bazaravpn.ru", "api_url": "https://vpn.bazaravpn.ru/x5do6FZ5R1Cz3m6vyONSpMCWKPuUD/api/v2/admin/user", "api_key": "6c2400c0-918c-4a9f-8a59-9df23838e4e6", "ws_path": "/gnLVPbCy2DikjbnpLXaz"},
    {"country": "🇩🇪 Германия", "domain": "germany.bazaravpn.ru", "api_url": "https://germany.bazaravpn.ru/JdbX7yhT37znZZ/api/v2/admin/user", "api_key": "27bc6d11-a699-4360-811c-260c3c0b37d3", "ws_path": "/JdbX7yhT37znZZ"},
    {"country": "🇹🇷 Турция", "domain": "turkey.bazaravpn.ru", "api_url": "https://turkey.bazaravpn.ru/yYEIuX3jX61MXzSQhSsY4/api/v2/admin/user", "api_key": "65478704-ac79-4636-a036-892e5aa65584", "ws_path": "/yYEIuX3jX61MXzSQhSsY4"},
    {"country": "🇯🇵 Япония", "domain": "japan.bazaravpn.ru", "api_url": "https://japan.bazaravpn.ru/fZ7s2sPOFD8NyUrv/api/v2/admin/user", "api_key": "fabcc56a-f2db-4d15-ac14-6d4b7d2f691f", "ws_path": "/fZ7s2sPOFD8NyUrv"},
    {"country": "🇳🇱 Нидерланды", "domain": "amsterdam.bazaravpn.ru", "api_url": "https://amsterdam.bazaravpn.ru/NGtiWweDZOri3gilZ8C7Rdcq/api/v2/admin/user", "api_key": "3391f3ff-6675-4076-8927-e75e1ac3b5e2", "ws_path": "/NGtiWweDZOri3gilZ8C7Rdcq"},
    {"country": "🇺🇸 США", "domain": "usa.bazaravpn.ru", "api_url": "https://usa.bazaravpn.ru/DKtwf29IZL72EISGNode/api/v2/admin/user", "api_key": "b21ba2e8-e5e9-48b5-9d21-846feae0ac48", "ws_path": "/DKtwf29IZL72EISGNode"},
    {"country": "🇿🇦 ЮАР", "domain": "afrika.bazaravpn.ru", "api_url": "https://afrika.bazaravpn.ru/roEf5khbBY2ufxS/api/v2/admin/user", "api_key": "ebe672ba-936a-4b84-b45a-9825295e9f87", "ws_path": "/roEf5khbBY2ufxS"},
    {"country": "🇵🇱 Польша", "domain": "poland.bazaravpn.ru", "api_url": "https://poland.bazaravpn.ru/sFDcLaHpTJHrrXP/api/v2/admin/user", "api_key": "c26d79e8-5a2d-456c-9d8c-df92e6a1fa1b", "ws_path": "/4SR1sPhbB1cQJqa5sJ"},
    {"country": "🇰🇿 Казахстан", "domain": "kazah.bazaravpn.ru", "api_url": "https://kazah.bazaravpn.ru/uGfehTZQvDsM8rFQPds/api/v2/admin/user", "api_key": "291064fa-4941-4599-9bfe-36c74e10789e", "ws_path": "/uGfehTZQvDsM8rFQPds"},
    {"country": "🇧🇷 Бразилия", "domain": "brazil.bazaravpn.ru", "api_url": "https://brazil.bazaravpn.ru/7TOOalXqIxw0mLkDYKuzV/api/v2/admin/user", "api_key": "acd95152-5874-436f-9b52-943fdb77dff3", "ws_path": "/7TOOalXqIxw0mLkDYKuzV"},
    {"country": "🇲🇾 Малайзия", "domain": "malaysia2.bazaravpn.ru", "api_url": "https://malaysia2.bazaravpn.ru/UNLncJhBzujAalD4HWM/api/v2/admin/user", "api_key": "1fcc5a62-6b07-4b8a-b6fe-21212a0343fb", "ws_path": "/UNLncJhBzujAalD4HWM"},
    {"country": "🇳🇬 Нигерия", "domain": "nigeria.bazaravpn.ru", "api_url": "https://nigeria.bazaravpn.ru/0kEjCdsKfaVf3SfxAVhD/api/v2/admin/user", "api_key": "d5868e9d-42b6-4a04-b94d-fa0109f18d65", "ws_path": "/0kEjCdsKfaVf3SfxAVhD"},
]

STATUS_FILE = "delete_status.json"
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "public")


def write_status(step, details=None):
    status = {"step": step, "details": details, "timestamp": datetime.now().isoformat()}
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(status, f, ensure_ascii=False, indent=2)

def delete_all_users():
    for server in SERVERS:
        country = server["country"]
        api_url = server["api_url"]
        api_key = server["api_key"]
        write_status(f"Получаем список пользователей с сервера {country} ({server['domain']})...")
        try:
            resp = requests.get(api_url, headers={"Hiddify-API-Key": api_key}, verify=False, timeout=20)
            if resp.status_code != 200:
                write_status(f"Ошибка получения пользователей с {country}", resp.text)
                continue
            users = resp.json()
            write_status(f"Найдено {len(users)} пользователей на {country}")
            for idx, user in enumerate(users):
                uuid = user.get("uuid")
                if not uuid:
                    continue
                del_url = f"{api_url}/{uuid}"
                try:
                    del_resp = requests.delete(del_url, headers={"Hiddify-API-Key": api_key}, verify=False, timeout=20)
                    if del_resp.status_code == 200:
                        write_status(f"Удалено на {country}: {idx+1}/{len(users)}", f"UUID: {uuid}")
                    else:
                        write_status(f"Ошибка удаления {uuid} на {country}", del_resp.text)
                except Exception as e:
                    write_status(f"Исключение при удалении {uuid} на {country}", str(e))
            write_status(f"Переход к следующему серверу после {country}")
        except Exception as e:
            write_status(f"Ошибка подключения к {country}", str(e))
    # Очистка public
    write_status("Очищаем папку public/ ...")
    try:
        for fname in os.listdir(PUBLIC_DIR):
            fpath = os.path.join(PUBLIC_DIR, fname)
            if os.path.isfile(fpath):
                os.remove(fpath)
        write_status("✅ Удаление завершено")
    except Exception as e:
        write_status("Ошибка при очистке public/", str(e))

if __name__ == "__main__":
    delete_all_users() 