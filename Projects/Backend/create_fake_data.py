# This file is used to create fake data for the event and hazard data.
import json
import copy
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, '..','db', 'event_Level.json')
new_json_file_path = os.path.join(script_dir, '..','db', 'new_event_Level.json')
geojson_file_path = os.path.join(script_dir, '..','db', 'hazard_Level.geojson')
new_geojson_file_path = os.path.join(script_dir, '..','db', 'new_hazard_Level.geojson')
with open(json_file_path, 'r') as f:
    events = json.load(f)
new_events = []

# create events data 

for j in range(0, 54):
  for i in range(0, 5):
      new_event = copy.deepcopy(events[i])
      current_id = new_event['event_ID']
      length = len(current_id)
      new_event['event_ID'] = current_id[0:length - 1] + str(int(current_id[length - 1]) + j + 6) 
      print(new_event)
      new_events.append(new_event)
all_events = events + new_events
print(len(all_events))
with open(new_json_file_path, 'w') as f:
    json.dump(all_events, f, indent=2)


# create hazard data
with open(geojson_file_path, 'r') as f:
    data = json.load(f)
new_features = []

for i in range(0, 54):
  x = 0
  for feature in data['features']:
    x += 1
    if x == 14:
       break
    new_feature = copy.deepcopy(feature)
    current_id = new_feature['properties']['event_ID']
    length = len(current_id)
    new_feature['properties']['event_ID'] = current_id[0:length - 1] + str(int(current_id[length - 1]) + 6 + i) 
    print(new_feature['properties']['event_ID'])
    new_features.append(new_feature)
data['features'] += new_features
with open(new_geojson_file_path, 'w') as f:
    json.dump(data, f, indent=2)