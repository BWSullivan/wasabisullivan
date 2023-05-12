import boto3
from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    s3 = boto3.client('s3')
    bucket_name = 'your-bucket-name'
    objects = s3.list_objects(Bucket=bucket_name)
    return str(objects)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
    