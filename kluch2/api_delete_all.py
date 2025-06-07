from flask import Flask, request, jsonify
import subprocess
import threading
import os
import json

app = Flask(__name__)

STATUS_FILE = os.path.join(os.path.dirname(__file__), "delete_status.json")
DELETE_SCRIPT = os.path.join(os.path.dirname(__file__), "delete_all_users.py")
ADMIN_PASSWORD = "huesos"

# --- Фоновый запуск удаления ---
def run_delete():
    subprocess.Popen(["python3", DELETE_SCRIPT])

@app.route("/api/delete-all-users", methods=["POST"])
def delete_all_users_api():
    data = request.get_json() or {}
    password = data.get("password")
    if password != ADMIN_PASSWORD:
        return jsonify({"error": "Неверный пароль"}), 403
    # Запускаем удаление в фоне
    threading.Thread(target=run_delete, daemon=True).start()
    return jsonify({"status": "started"})

@app.route("/api/delete-all-users/status", methods=["GET"])
def delete_status():
    if not os.path.exists(STATUS_FILE):
        return jsonify({"step": "Ожидание запуска..."})
    with open(STATUS_FILE, "r", encoding="utf-8") as f:
        status = json.load(f)
    return jsonify(status)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5010) 