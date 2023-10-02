from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    # Instead of fetching objects from S3, return a placeholder message
    return "Hello, this is the local version of the app!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))