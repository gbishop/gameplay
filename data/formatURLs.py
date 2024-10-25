import sqlite3
import json
import urllib.parse
import numpy as np


def build_url(base_url, path, args_dict):
    # Returns a list in the structure of urlparse.ParseResult
    url_parts = list(urllib.parse.urlparse(base_url))
    url_parts[2] = path
    url_parts[4] = urllib.parse.urlencode(args_dict)
    return urllib.parse.urlunparse(url_parts)


base_url = "https://gbishop.github.io"
path = "THG"

lengths = []
longest = 0
with sqlite3.connect("games.sqlite") as connection:
    cursor = connection.cursor()
    for row in cursor.execute("""select json from games"""):
        game = json.loads(row[0])
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
            args.append(("i", game["interval"]))
            args.append(("e", game["end"]))
            args.append(("p", game["message"]))

        elif kind == "foo":
            for tp in game["timePoints"]:
                args.append(("t", tp["time"]))
                args.append(("p", tp["choices"][0]["prompt"]))

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
        lengths.append(len(url))
        if len(url) > longest:
            print(len(url), url)
            longest = len(url)


lengths = np.array(lengths)

print(f"min = {lengths.min()} max = {lengths.max()} mean = {lengths.mean()}")
