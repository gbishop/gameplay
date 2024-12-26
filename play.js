import './modulepreload-polyfill.js';
/* empty css       */

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

class YouTubeIFrameCtrl {
  errors = [
    "Element not found",
    "Element is not an iframe",
    "Youtube url does not include query parameter - enablejsapi=1 - JS API is disabled",
  ];
  playerStates = {
    [-2]: "NOT_READY",
    [-1]: "UNSTARTED",
    [0]: "ENDED",
    [1]: "PLAYING",
    [2]: "PAUSED",
    [3]: "BUFFERING",
    [5]: "CUED",
  };
  currentPlayerStateCode = -2;
  iframe;
  loaded;
  messageListener = null;
  constructor(iframe) {
    let element = null;
    if (typeof iframe === "string") {
      element = document.querySelector(iframe);
      if (element === null) {
        this.throwError(0, iframe);
      }
    } else {
      element = iframe;
    }
    if (element instanceof HTMLIFrameElement) {
      this.iframe = element;
    } else {
      this.throwError(1);
    }
    if (!this.iframe.src.includes("enablejsapi=1")) {
      this.throwError(2, this.iframe.src);
    }
    this.loaded = new Promise((resolve) => {
      let loaded = false;
      const loadListener = () => {
        this.iframe.removeEventListener("load", loadListener);
        setTimeout(() => {
          this.iframe.contentWindow?.postMessage('{"event":"listening"}', "*");
        });
      };
      this.iframe.addEventListener("load", loadListener);
      this.messageListener = (event) => {
        if (event.source === this.iframe.contentWindow && event.data) {
          let eventData;
          try {
            eventData = JSON.parse(event.data);
          } catch {
            return;
          }
          if (eventData.event === "onReady" && !loaded) {
            loaded = true;
            this.iframe.removeEventListener("load", loadListener);
            resolve(true);
          }
          if (typeof eventData.info?.playerState === "number") {
            this.stateChangeHandler(eventData.info.playerState);
          }
          this.messageHandler(eventData);
        }
      };
      window.addEventListener("message", this.messageListener);
      this.iframe.contentWindow?.postMessage('{"event":"listening"}', "*");
    });
  }
  throwError(errorCode, optionalMessage) {
    throw new Error(
      this.errors[errorCode] + (optionalMessage ? `: ${optionalMessage}` : "."),
    );
  }
  stateChangeHandler(playerStateCode) {
    this.currentPlayerStateCode = playerStateCode;
    const event = new CustomEvent("ytstatechange", {
      detail: this.playerStates[this.currentPlayerStateCode],
    });
    this.iframe.dispatchEvent(event);
  }
  messageHandler(data) {
    const event = new CustomEvent("ytmessage", { detail: data });
    this.iframe.dispatchEvent(event);
  }
  async command(command, args) {
    await this.loaded;
    this.iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: args || [],
      }),
      "*",
    );
  }
  async play() {
    return this.command("playVideo");
  }
  async pause() {
    return this.command("pauseVideo");
  }
  async stop() {
    return this.command("stopVideo");
  }
  async mute() {
    return this.command("mute");
  }
  async unMute() {
    return this.command("unMute");
  }
  get playerState() {
    return this.playerStates[this.currentPlayerStateCode];
  }
}

const movers = new Set([" ", "ArrowRight"]);
const choosers = new Set(["Enter", "ArrowLeft"]);

/** @param {Game} game */
function play(game) {
  const message = document.getElementById("message");

  if (!message) throw Error("bad dom");

  const iframe = `<iframe
  id="youtube-iframe"
  src="https://www.youtube-nocookie.com/embed/${game.video}?enablejsapi=1"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
>
</iframe>`;

  const app = document.getElementById("app");
  if (!app) throw Error("bad dom");

  app.innerHTML = iframe;

  const iframeElement = document.querySelector("iframe");
  if (!iframeElement) throw Error("missing iframe");
  const player = new YouTubeIFrameCtrl(iframeElement);

  let TPIndex = 0;
  let Duration = 0;

  showPrompt({ time: 0, choices: [{ prompt: "Play", next: -1 }] }, 0);

  iframeElement.addEventListener(
    "ytmessage",
    (/** @type {CustomEvent} */ event) => {
      const data = event.detail;
      if (Duration == 0 && "duration" in data.info) {
        Duration = data.info.duration;
        console.log("Duration", Duration);
        if (Duration > 0) {
          game.timePoints.push({
            time: Duration,
            choices: [
              { prompt: "Again?", next: -1 },
              { prompt: "Quit", next: -2 },
            ],
          });
        }
      }
      const seconds = data.info.currentTime;
      if (seconds >= game.timePoints[TPIndex].time) {
        const tp = game.timePoints;
        player.pause();
        showPrompt(tp[TPIndex], 0);
      }
    },
  );
  iframeElement.addEventListener(
    "ytstatechange",
    (/** @type {CustomEvent} */ event) => {
      console.log("Player state changed to:", event.detail);
      if (event.detail == "ENDED") {
        const tp = game.timePoints;
        showPrompt(tp[tp.length - 1], 0);
      }
    },
  );

  /**
   * @param {TimePoint} tp
   * @param {number} select
   * */
  function showPrompt(tp, select) {
    if (!message) return;
    message.replaceChildren();
    const prompts = tp.choices.map(
      (choice, index) =>
        `<button ${index == select ? "selected" : ""} next=${choice.next}>${choice.prompt}</button>`,
    );
    message.innerHTML = prompts.join("");
    message.removeAttribute("hide");
  }

  document.addEventListener("keyup", (event) => {
    if (movers.has(event.key)) {
      const targets = [...document.querySelectorAll("button,a")];
      const selected = document.querySelector("[selected]");
      let index = 0;
      if (selected) {
        index = (targets.indexOf(selected) + 1) % targets.length;
        selected.removeAttribute("selected");
      }
      targets[index].setAttribute("selected", "");
    } else if (choosers.has(event.key)) {
      const selected = document.querySelector("[selected]");
      if (selected instanceof HTMLElement) {
        choose(selected);
      }
    }
  });

  document.addEventListener("pointerup", (event) => {
    if (event.target instanceof HTMLButtonElement) {
      choose(event.target);
    }
  });

  /** @param {HTMLElement} target */
  function choose(target) {
    if (target instanceof HTMLButtonElement) {
      const next = parseInt(target.getAttribute("next") || "0");
      if (next == 0) {
        TPIndex += 1;
        go();
      } else if (next == -1) {
        TPIndex = 0;
        player.command("seekTo", [game.start, true]);
        // player.seek(game.start);
        go();
      } else if (next == -2) {
        console.log("quit");
        history.back();
      } else {
        // player.seek(next);
        player.command("seekTo", [next, true]);
        for (let i = 0; i < game.timePoints.length; i++) {
          if (game.timePoints[i].time >= next) {
            TPIndex = i;
            break;
          }
        }
        go();
      }
    } else if (target instanceof HTMLAnchorElement) {
      target.click();
    }
  }

  function go() {
    if (!message) throw Error("bad dom");
    message.setAttribute("hide", "");
    player.play();
  }
}

if (location.search) {
  const game = decode(new URL(location.href));
  play(game);
}
//# sourceMappingURL=play.js.map
