import requests
import json
import sqlite3

findURL = "https://tarheelgameplay.org/find/"
getURL = "https://tarheelgameplay.org/gameplay-as-json/"

with sqlite3.connect("games.sqlite") as connection:
    cursor = connection.cursor()

    cursor.execute(
        """create table if not exists games (
            id integer primary key,
            json text not null
            )
        """
    )

    # estimate where to start
    cursor.execute("select count(*) from games")
    result = cursor.fetchone()
    count = result[0]
    page = count // 24 + 1
    print(f"start at page {page}")

    more = 1
    while more:
        r = requests.get(findURL, params={"page": page, "json": 1})
        data = r.json()
        gameplays = data["gameplays"]
        for gameplay in gameplays:
            exists = cursor.execute(
                "select id from games where id = ?", (gameplay["ID"],)
            ).fetchone()
            if exists:
                continue
            g = requests.get(getURL, params={"id": gameplay["ID"]})
            try:
                game = g.json()
            except:
                print(g.text)
                break
            cursor.execute(
                "insert into games values(?, ?)", [game["ID"], json.dumps(game)]
            )
            connection.commit()
            count += 1
            if count % 100 == 0:
                print(count, game["link"])
        more = data["more"]
        page += 1
