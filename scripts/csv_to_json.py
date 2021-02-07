import csv
import json

paths = [
    '../data/crime_data_2018.csv',
    '../data/crime_data_2019.csv',
    '../data/crime_data_2020.csv'
]

export_json_path = '../public/data/crime_data.json'

keys = {
    "crimeType": [
        "刑法犯総数",
        "窃盗犯総数",
        "重要犯罪総数",
        "殺人",
        "強盗",
        "強盗殺人",
        "放火",
        "強制性交等",
        "略奪誘拐・人身売買",
        "強制わいせつ",
        "重要窃盗犯総数",
        "侵入盗",
        "侵入盗(住宅対象)",
        "侵入盗(その他)",
        "自動車盗",
        "ひったくり",
        "すり"
    ],
    "prefectures": [
        "全国",
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "東京都",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "神奈川県",
        "新潟県",
        "山梨県",
        "長野県",
        "静岡県",
        "富山県",
        "石川県",
        "福井県",
        "岐阜県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
    ]
}

data = {}

for prefecture in keys["prefectures"]:
    data[prefecture] = {}
    for crime_type in keys["crimeType"]:
        data[prefecture][crime_type] = []


def convert_data(data_url):
    global data
    with open(data_url, newline='', mode='r') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        year = None
        for index, row in enumerate(spamreader):
            if index == 0:
                year = int(row[1])
                continue

            crime_type = row[0]
            prefecture = row[1]

            if prefecture in data and crime_type in data[prefecture]:
                last = 0
                for index, d in enumerate(row[2:len(row)]):
                    if d != '':
                        value = int(d)
                        # not to add 2020/12 data because of null
                        if year == 2020 and index == 11:
                            last = 0
                            value = 0
                        if index == 0:
                            data[prefecture][crime_type].append(
                                {"year": year, "month": index+1, "value": value})
                            last = value
                            continue
                        data[prefecture][crime_type].append(
                            {"year": year, "month": index+1, "value": value - last})
                        last = value
            #             data['values'].append(value - data['values'][index - 1])
            # data[prefecture][crime_type].append(
            #     get_monthly_data(row, year))


def normalize():
    global data
    maxs = {}
    mins = {}

    for prefecture in keys['prefectures']:
        maxs[prefecture] = {}
        mins[prefecture] = {}
        for crime_type in keys['crimeType']:
            maxs[prefecture][crime_type] = 0
            mins[prefecture][crime_type] = float('inf')
            for item in data[prefecture][crime_type]:
                if maxs[prefecture][crime_type] < item['value']:
                    maxs[prefecture][crime_type] = item['value']
                if item['value'] < mins[prefecture][crime_type]:
                    mins[prefecture][crime_type] = item['value']

    for prefecture in keys['prefectures']:
        for crime_type in keys['crimeType']:
            for item in data[prefecture][crime_type]:
                item['normalizedValue'] = 0 if maxs[prefecture][crime_type] == 0 else (
                    item['value'] - mins[prefecture][crime_type]) / (maxs[prefecture][crime_type] - mins[prefecture][crime_type])


for path in paths:
    convert_data(path)

normalize()

with open(export_json_path, mode='w') as json_w:
    json_w.write(json.dumps({"keys": keys, "data": data}, ensure_ascii=False))
