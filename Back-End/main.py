from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_api import status
from Util import *
import traceback

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET'])
def main():
    try:
        result = read_files()
        if(result):
            return jsonify(data = result), status.HTTP_200_OK
        else:
            return "No Data Found", status.HTTP_404_NOT_FOUND
    except Exception as e:
        print(traceback.format_exc())
        return "Internal Server Error", status.HTTP_500_INTERNAL_SERVER_ERROR
    
if __name__ == '__main__':
    app.run()