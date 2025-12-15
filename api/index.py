from flask import Flask, jsonify
import sys
import traceback

try:
    # Try to import your app normally
    from app import app
except Exception as e:
    # If app.py crashes, create a generic "Error App" to show the error on screen
    app = Flask(__name__)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        # Print the full error stack trace to the browser
        error_msg = traceback.format_exc()
        return f"<h1>App Crashed During Startup</h1><pre>{error_msg}</pre>", 500

# This is needed for Vercel
if __name__ == '__main__':
    app.run()
    