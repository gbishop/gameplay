import { decode } from "../url";
import { YouTubePlayer } from "../yt-player";
const movers = new Set([" ", "ArrowRight"]);
const choosers = new Set(["Enter", "ArrowLeft"]);

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

  document.addEventListener("keyup", (event) => {
    console.log(event);
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
} else {
}
