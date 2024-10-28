true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

/* Encode and Decode games from URLs */


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

  let t0 = P("s", 0) / 10;
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
  const interval = P("i", 0) / 10;
  const end = P("e", 0) / 10;
  const prompt = P("p", "");
  if (interval && end && prompt) {
    for (let t = t0 + interval; t <= end; t += interval) {
      game.timePoints.push({
        time: t,
        choices: [{ prompt, next: 0 }],
      });
    }
  } else {
    let pat = /[tT](?<time>\d+)(?<choices>(?:[cbqpnN]\d+)+)/g;
    let cpat = /(?<key>[cbqp])(?<prompt>\d+)(?:(?<sign>[nN])(?<next>\d+))?/g;
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
        const groups = cmatch.groups;
        if (!groups) continue;
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
  }
  return game;
}

export { decode as d };
//# sourceMappingURL=url.js.map
