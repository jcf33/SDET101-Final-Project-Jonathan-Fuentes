from flask import Flask
import traceback

# Placeholder for the error message
STARTUP_ERROR = None

try:
    # Try to load your app
    from app import app
except Exception:
    # CRITICAL: Capture the error string RIGHT NOW
    STARTUP_ERROR = traceback.format_exc()
    
    # Create a dummy app just to display the error
    app = Flask(__name__)

# If an error was captured, override all routes to show it
if STARTUP_ERROR:
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return f"<h1>App Crashed During Startup</h1><pre>{STARTUP_ERROR}</pre>", 500

if __name__ == '__main__':
    app.run()