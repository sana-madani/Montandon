import csv
import json
import os
# 读取 TSV 文件并转换为 JSON
def tsv_to_json(tsv_file, json_file):
        with open(tsv_file, 'r', newline='', encoding='utf-8') as tsvfile:
            # Use DictReader to read TSV file with specified delimiter
            reader = csv.DictReader(tsvfile, delimiter='\t')
        
            # Store data as a list
            data = [row for row in reader]

        # Write data to JSON file
        with open(json_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, ensure_ascii=False, indent=2)

# 使用示例
tsv_file_path = 'Backend/export_data/impact_Level_2000-01-01_2024-02-05_EQ.tsv'
json_file_path = 'Backend/export_data/impact_Level_2000-01-01_2024-02-05_EQ1.json'
#print(os.getcwd())
tsv_to_json(tsv_file_path, json_file_path)
