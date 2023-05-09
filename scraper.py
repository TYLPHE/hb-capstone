import requests
import json
from time import sleep


def scrape(app_id):
    """ query api every 1.5 seconds and save results to file """

    params = {
      'appids': int(app_id),
    }

    url = f'http://store.steampowered.com/api/appdetails'

    res = requests.get(url, params=params)

    js = res.json()

    d = {}
    d['id'] = js.get(f"{params['appids']}", app_id).get('data', {}).get('steam_appid')
    d['name'] = js.get(f"{params['appids']}", {}).get('data', {}).get('name')
    d['short_description'] = js.get(f"{params['appids']}", {}).get('data', {}).get('short_description')
    d['header_image'] = js.get(f"{params['appids']}", {}).get('data', {}).get('header_image')
    d['background'] = js.get(f"{params['appids']}", {}).get('data', {}).get('background')
    d['release_date'] = js.get(f"{params['appids']}", {}).get('data', {}).get('release_date', {}).get('date')
    d['developers'] = js.get(f"{params['appids']}", {}).get('data', {}).get('developers')
    d['publishers'] = js.get(f"{params['appids']}", {}).get('data', {}).get('publishers')
    d['genres'] = js.get(f"{params['appids']}", {}).get('data', {}).get('genres')
    d['screenshots'] = js.get(f"{params['appids']}", {}).get('data', {}).get('screenshots')
    d['movies'] = js.get(f"{params['appids']}", {}).get('data', {}).get('movies')

    with open('data/test.json', 'r') as game:
        data = game.read()

    h = json.loads(data)
    h.append(d)

    with open('data/test.json', 'w') as f:
        # json.dump(d, f)
        f.write(json.dumps(h, indent=2))


# with open('test-top.txt', 'r') as f:
#     for id in f:
#         print(f'Scrape: {id}')
#         scrape(id)
#         sleep(1.6)