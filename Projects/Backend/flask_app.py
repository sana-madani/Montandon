from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import initialize_and_sort_events, send_all, send_selected

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def receive_data_from_frontend():
    data_from_frontend = request.get_json()
    return jsonify(send_selected(data_from_frontend))

@app.route('/')
def get_data():
    return jsonify(send_all())

if __name__ == '__main__':
    initialize_and_sort_events()
    app.run(debug=True)

