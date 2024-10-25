/* Encode and Decode games from URLs */

const site = "http://localhost:8080";

/** @type {Game} */
export const example = {
  title: "Stopwatch - Count Up Timer (1 Hour)",
  video: "FaWIn_wjo6w",
  start: 0.0,
  timePoints: [
    {
      time: 1,
      choices: [
        {
          prompt: "p 1",
          next: 0,
        },
        {
          prompt: "start over",
          next: -1,
        },
        {
          prompt: "quit",
          next: -2,
        },
      ],
    },
    {
      time: 3,
      choices: [
        {
          prompt: "p 3",
          next: 0,
        },
        {
          prompt: "p 2",
          next: 2,
        },
        {
          prompt: "start over",
          next: -1,
        },
        {
          prompt: "quit",
          next: -2,
        },
      ],
    },
    {
      time: 7,
      choices: [
        {
          prompt: "p 7",
          next: 0,
        },
        {
          prompt: "start over",
          next: -1,
        },
        {
          prompt: "quit",
          next: -2,
        },
      ],
    },
  ],
};

/** @param {string} key
 * @param {number} value
 */
function signed(key, value) {
  if (value < 0) {
    key = key.toUpperCase();
    value = -value;
  }
  return `${key}${value}`;
}

/**
 * @param {Game} game
 * @returns {URL}
 **/
export function encode(game) {
  const url = new URL(site);
  url.searchParams.append("t", game.title);
  url.searchParams.append("v", game.video);
  let t0 = Math.round(game.start * 10);
  url.searchParams.append("s", t0.toString());
  const g = [];
  const prompts = {};
  for (const tp of game.timePoints) {
    const time = Math.round(tp.time * 10);
    g.push(`t${time - t0}`);
    for (const choice of tp.choices) {
      const p = choice.prompt.trim();
      if (!(p in prompts)) {
        prompts[p] = Object.keys(prompts).length;
      }
      let next = choice.next;
      let key = { [0]: "c", [-1]: "b", [-2]: "q" }[next] || "p";
      g.push(`${key}${prompts[p]}`);
      if (key == "p") {
        next = Math.round(10 * next - t0);
        g.push(signed("n", next));
      }
      t0 = time;
    }
  }
  url.searchParams.append("g", g.join(""));
  for (const prompt in prompts) {
    url.searchParams.append("d", prompt);
  }
  return url;
}

/**
 * Decode a URL into a game
 * @param {URL} url
 * @returns {Game}
 */
function decode(url) {
  const sp = url.searchParams;
  /**
   * Return value of a parameter or default
   * @template {string | number} T
   * @param {string} key
   * @param {T} def
   * @returns {T}
   */
  function P(key, def) {
    const result = sp.get(key);
    if (!result) {
      return def;
    }
    if (typeof def === "string") {
      return /** @type {T} */ (result);
    } else if (typeof def === "number") {
      return /** @type {T} */ (parseInt(result));
    }
    return def;
  }

  let t0 = P("s", 0);
  /** @type {Game} */
  const game = {
    title: P("t", "untitled"),
    video: P("v", ""),
    start: t0,
    timePoints: [],
  };
  const prompts = [];
  for (const [key, value] of sp) {
    if (key == "d") {
      prompts.push(value);
    }
  }
  let pat = /[tT](?<time>\d+)(?<choices>(?:[cbqpnN]\d+)+)/g;
  let cpat =
    /(?<key>[cbq])(?<prompt>\d+)|(?<key>p)(?<prompt>\d+)(?<sign>[nN])(?<next>\d+)/g;
  for (const match of P("g", "").matchAll(pat)) {
    const groups = match.groups;
    if (!groups) continue;
    t0 += parseInt(groups.time) / 10;
    /** @type {TimePoint} tp */
    const tp = {
      time: t0,
      choices: [],
    };
    for (const cmatch of groups.choices.matchAll(cpat)) {
      const choice = {
        prompt: prompts[+groups.prompt],
        next: 0,
      };
      const key = groups.key;
      if (key == "b") {
        choice.next = -1;
      } else if (key == "q") {
        choice.next = -2;
      } else if (key == "p") {
        choice.next =
          (parseInt(groups.next) / 10) * { n: 1, N: -1 }[groups.sign] + t0;
      }
      tp.choices.push(choice);
    }
    game.timePoints.push(tp);
  }
  return game;
}

/**
 * Compare objects for equality
 * @param {number | string | Object} a
 * @param {number | string | Object} b
 * returns {boolean}
 */
function equal(a, b) {
  if (a == b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length == b.length) {
      return a.every((v, i) => equal(v, b[i]));
    }
    return false;
  }
  if (typeof a == "object" && typeof b == "object") {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    return equal(ka, kb) && ka.every((v, i) => equal(v, kb[i]));
  }

  return false;
}

let u = encode(example);
let s = u.search;
if (s != window.location.search) window.location.search = s;
let u2 = new URL(window.location.href);
const result = decode(u2);
console.log("equal", equal(example, result));
