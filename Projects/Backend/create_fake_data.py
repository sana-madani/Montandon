import json
import copy
import os
import json
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, '..','db', 'event_Level.json')
new_json_file_path = os.path.join(script_dir, '..','db', 'new_event_Level.json')
geojson_file_path = os.path.join(script_dir, '..','db', 'hazard_Level.geojson')
new_geojson_file_path = os.path.join(script_dir, '..','db', 'new_hazard_Level.geojson')
# 读取 JSON 文件的内容
with open(json_file_path, 'r') as f:
    events = json.load(f)

# 创建一个新的列表，用于存储修改后的对象
new_events = []

# for j in range(0, 54):
#   for i in range(0, 5):
#       new_event = copy.deepcopy(events[i])
#       current_id = new_event['event_ID']
#       length = len(current_id)
#       new_event['event_ID'] = current_id[0:length - 1] + str(int(current_id[length - 1]) + j + 6) 
#       print(new_event)
#       new_events.append(new_event)
# all_events = events + new_events
# print(len(all_events))
# with open(new_json_file_path, 'w') as f:
#     json.dump(all_events, f, indent=2)


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

# 将原始 features 列表和新的列表合并为一个新的列表
data['features'] += new_features

# 将新的 JSON 对象写入到原始的 JSON 文件中
with open(new_geojson_file_path, 'w') as f:
    json.dump(data, f, indent=2)