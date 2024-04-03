# this python script is a Flask web application that serves as 
# an API for processing and serving event data. 
# It reads data from two JSON files, 
# processes the data using the initial_events function, 
# and starts the Flask application in debug mode.
from flask import Flask, request, jsonify
from flask_cors import CORS
from event_processing import initial_events, send_all, send_selected
import os
import json

app = Flask(__name__)
CORS(app)


# the first route ‘/’ with method GET 
# returns all events processed by the send_all function as JSON.
@app.route('/')
def get_data():
    return jsonify(send_all(events))

# the second route ‘/’ with method POST receives JSON data 
# from the frontend, processes it using the send_selected function, 
# and returns the result as JSON.
@app.route('/', methods=['POST'])
def receive_data_from_frontend():
    data_from_frontend = request.get_json()
    return jsonify(send_selected(events, data_from_frontend))




if __name__ == '__main__':
    global events, df1, df2
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # if testing less data, change the file path
    # new_event_Level.json -> event_Level.json
    # new_hazard_Level.geojson -> hazard_Level.geojson
    json_file_path = os.path.join(script_dir, '..','db', 'new_event_Level.json')
    geojson_file_path = os.path.join(script_dir, '..','db', 'new_hazard_Level.geojson')
    with open(json_file_path, 'r') as file1:
        data1 = json.load(file1)
    with open(geojson_file_path, 'r') as file2:
        data2 = json.load(file2)

    events = initial_events(data1, data2)
    file1.close()
    file2.close()
    app.run(debug=True)

