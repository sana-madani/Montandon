from functions import initial_events, sort_events_by_date, send_all, send_selected
import pandas as pd
import geopandas as gpd
import json
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, 'Example_Data', 'event_Level.json')
geojson_file_path = os.path.join(script_dir, 'Example_Data', 'hazard_Level.geojson')

# summary mapping detail
json_file_path1 = os.path.join(script_dir, 'export_data', 'event_Level_2000-01-01_2024-02-05_EQ.json')
json_file_path2 = os.path.join(script_dir, 'export_data', 'hazard_Level_2000-01-01_2024-02-05_EQ.json')

df1 = pd.read_json(json_file_path, encoding='utf_8_sig')
df2 = gpd.read_file(geojson_file_path, encoding='utf_8_sig')

#df1 = pd.read_json(json_file_path1, encoding='utf_8_sig')
#df2 = pd.read_json(json_file_path2, encoding='utf_8_sig')

app = Flask(__name__)
CORS(app)

@app.route('/', methods = ['POST'])
def receive_data_from_fronted():
    data_from_fronted = request.get_json()
    if data_from_fronted["type"] == "": #and data_from_fronted["country"] == "" and data_from_fronted["continent"] == "":
        return jsonify(send_all())
    else:
        return jsonify(send_selected(data_from_fronted))

@app.route('/')
def get_data():
    return jsonify(send_all())


def run():
    events = initial_events(df1, df2)
    events = sort_events_by_date(events)
    app.run(debug=True)
