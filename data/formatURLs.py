import sqlite3
import json
import urllib.parse
from PIL import Image
import requests
import io


def validate_videoId(videoId):
    url = f"http://img.youtube.com/vi/{videoId}/mqdefault.jpg"
    r = requests.get(url)
    if r.ok:
        img = Image.open(io.BytesIO(r.content))
        return img.width != 120
    else:
        return False


def build_url(base_url, path, args_dict):
    # Returns a list in the structure of urlparse.ParseResult
    url_parts = list(urllib.parse.urlparse(base_url))
    url_parts[2] = path
    url_parts[4] = urllib.parse.urlencode(args_dict)
    return urllib.parse.urlunparse(url_parts)


popular_games = []
for line in open("games.txt", "r"):
    count, url = line.split()
    count = int(count)
    url = url.strip()
    slug = url.split("/")[-2]
    popular_games.append((count, slug))

base_url = ""
path = "./"

games = {}
with sqlite3.connect("games.sqlite") as connection:
    cursor = connection.cursor()
    for row in cursor.execute("""select json from games"""):
        game = json.loads(row[0])
        games[game["slug"]] = game

links = []
for count, slug in popular_games[:100]:
    game = games.get(slug)
    if not game:
        continue
    if not validate_videoId(game["videoId"]):
        print("invalid", slug)
        continue
    args = []
    kind = game.get("kind")
    if not kind:
        tags = game.get("tags")
        if tags:
            for kind in ["basic", "precise", "advanced"]:
                if kind in tags:
                    break
            else:
                print(game)
                continue
    args.append(("v", game["videoId"]))
    args.append(("s", game["start"]))
    args.append(("t", game["title"]))
    if kind == "basic":
        args.append(("i", int(game["interval"] * 10)))
        args.append(("e", int(game["end"] * 10)))
        args.append(("p", game["message"]))

    else:
        prompts = {}
        times = []
        s = []
        t0 = 0
        for timePoint in game["timePoints"]:
            time = int(timePoint["time"] * 10) - t0
            if time < 0:
                s.append(f"T{-time}")
            else:
                s.append(f"t{time}")
            for choice in timePoint["choices"]:
                p = choice["prompt"].strip()
                if p not in prompts:
                    prompts[p] = len(prompts)
                next = choice["next"]
                if next == 0:
                    key = "c"
                elif next == -1:
                    key = "b"
                elif next == -2:
                    key = "q"
                else:
                    key = "p"
                    next = int(next * 10) - t0
                s.append(f"{key}{prompts[p]}")
                if key == "p":
                    if next < 0:
                        s.append(f"N{-next}")
                    else:
                        s.append(f"n{next}")
            t0 = time
        args.append(("g", "".join(s)))
        for p in prompts:
            args.append(("d", p))
    url = build_url(base_url, path, args)
    links.append(url)
    if len(links) >= 100:
        break

json.dump(links, open("links.json", "w"), indent=2)
