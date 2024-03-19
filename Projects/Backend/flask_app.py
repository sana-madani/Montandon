from flask import Flask, request, jsonify
from flask_cors import CORS
from event_processing import initial_events, send_all, send_selected
import os
import json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def receive_data_from_frontend():
    data_from_frontend = request.get_json()
    return jsonify(send_selected(events, data_from_frontend))

@app.route('/')
def get_data():
    return jsonify(send_all(events))

if __name__ == '__main__':
    global events, df1, df2
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, '..','db', 'event_Level.json')
    geojson_file_path = os.path.join(script_dir, '..','db', 'hazard_Level.geojson')
    with open(json_file_path, 'r') as file1:
        data1 = json.load(file1)
    with open(geojson_file_path, 'r') as file2:
        data2 = json.load(file2)

    events = initial_events(data1, data2)
    file1.close()
    file2.close()
    app.run(debug=True)

