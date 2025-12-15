from flask import Flask
import sys
import os
import traceback

# --- CRITICAL FIX: Tell Python to look inside the current folder ---
# This forces Vercel to see 'app.py' which sits right next to this file
sys.path.append(os.path.dirname(__file__))

STARTUP_ERROR = None

try:
    # Now this import will work because we fixed the path above
    from app import app
except Exception:
    STARTUP_ERROR = traceback.format_exc()
    app = Flask(__name__)

if STARTUP_ERROR:
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return f"<h1>App Crashed During Startup</h1><pre>{STARTUP_ERROR}</pre>", 500

if __name__ == '__main__':
    app.run()