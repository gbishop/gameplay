import { example, decode } from "./url";
import { YouTubePlayer } from "./yt-player";

/** @param {Game} game */
function play(game) {
  const message = document.getElementById("message");

  if (!message) throw Error("bad dom");

  const player = new YouTubePlayer("#app", {
    timeupdateFrequency: 20,
    controls: false,
    modestBranding: true,
    related: false,
    keyboard: false,
    fullscreen: true,
    annotations: false,
  });

  let TPIndex = 0;
  let Duration = 0;

  player.load(game.video, false, game.start);
  showPrompt({ time: 0, choices: [{ prompt: "Play", next: -1 }] }, 0);
  player.on("timeupdate", (seconds) => {
    if (seconds >= game.timePoints[TPIndex].time) {
      const tp = game.timePoints;
      player.pause();
      showPrompt(tp[TPIndex], -1);
    }
  });
  player.on("playing", () => {
    if (Duration == 0) {
      Duration = player.getDuration();
      if (Duration > 0) {
        game.timePoints.push({
          time: Duration,
          choices: [{ prompt: "Again?", next: -1 }],
        });
      }
    }
  });
  player.on("ended", () => {
    const tp = game.timePoints;
    showPrompt(tp[tp.length - 1], 0);
  });

  /** @param {TimePoint} tp
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

  const movers = new Set([" ", "ArrowRight"]);
  const choosers = new Set(["Enter", "ArrowLeft"]);
  document.addEventListener("keyup", (event) => {
    if (movers.has(event.key)) {
      const buttons = [...message.querySelectorAll("button")];
      const selected = /** @type {HTMLButtonElement} */ (
        message.querySelector("button[selected]")
      );
      let index = 0;
      if (selected) {
        index = (buttons.indexOf(selected) + 1) % buttons.length;
        selected.removeAttribute("selected");
      }
      buttons[index].setAttribute("selected", "");
    } else if (choosers.has(event.key)) {
      const selected = /** @type {HTMLButtonElement} */ (
        message.querySelector("button[selected]")
      );
      if (selected) {
        choose(selected);
      }
    }
  });

  message.addEventListener("pointerup", (event) => {
    if (event.target instanceof HTMLButtonElement) {
      choose(event.target);
    }
  });

  /** @param {HTMLButtonElement} button */
  function choose(button) {
    const next = parseInt(button.getAttribute("next") || "0");
    if (next == 0) {
      TPIndex += 1;
      go();
    } else if (next == -1) {
      TPIndex = 0;
      player.seek(game.start);
      go();
    } else if (next == -2) {
      console.log("quit");
    } else {
      player.seek(next);
      for (let i = 0; i < game.timePoints.length; i++) {
        if (game.timePoints[i].time >= next) {
          TPIndex = i;
          break;
        }
      }
      go();
    }
  }

  function go() {
    if (!message) throw Error("bad dom");
    message.setAttribute("hide", "");
    player.play();
  }
}

console.log("main");
if (location.search) {
  const game = decode(new URL(location.href));
  console.log({ game });
  play(game);
} else {
  play(example);
}
