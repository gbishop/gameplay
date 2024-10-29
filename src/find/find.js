// @ts-ignore
import links from "./links.json";
const movers = new Set([" ", "ArrowRight"]);
const choosers = new Set(["Enter", "ArrowLeft"]);

function index() {
  const html = [];
  for (const link of links) {
    const url = new URL(location.href);
    url.search = link.slice(3);
    const sp = url.searchParams;
    const videoId = sp.get("v");
    const src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    const cell = `
      <a href="../play/${link}">
        <figure>
          <img src="${src}" loading="lazy"\>
          <figcaption>${sp.get("t")}</figcaption>
        </figure>
      </a>`;
    html.push(cell);
  }
  const app = document.getElementById("app");
  if (!app) {
    throw Error("Bad Dom");
  }
  const message = document.getElementById("message");
  if (!message) {
    throw Error("Bad Dom");
  }
  app.innerHTML = html.join("");
  message.style.display = "none";
  document.addEventListener("keyup", (event) => {
    if (movers.has(event.key)) {
      const targets = [...document.querySelectorAll("a")];
      const selected = document.activeElement;
      let index = 0;
      if (selected instanceof HTMLAnchorElement) {
        index = (targets.indexOf(selected) + 1) % targets.length;
      }
      targets[index].focus();
    } else if (choosers.has(event.key)) {
      const selected = document.activeElement;
      if (selected instanceof HTMLAnchorElement) {
        selected.click();
      }
    }
  });
  const ReducedMotion = window.matchMedia(
    `(prefers-reduced-motion: reduce)`,
  ).matches;
  let timer;
  if (!ReducedMotion) {
    app.addEventListener("focusin", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        const figure = event.target.firstElementChild;
        if (figure instanceof HTMLElement) {
          // center of window
          const wc = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          // figure bounding box
          const fcr = figure.getBoundingClientRect();
          // center of figure
          const fc = { x: fcr.x + fcr.width / 2, y: fcr.y + fcr.height / 2 };
          // translate center of figure to center of screen
          const delta = { x: wc.x - fc.x, y: wc.y - fc.y };
          figure.style.transform = `translate(${delta.x}px, ${delta.y}px) scale(2)`;
          figure.style.transition = `transform 0.2s linear`;
          timer = setInterval(() => (figure.style.transform = ""), 5000);
        }
      }
    });
    app.addEventListener("focusout", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        const figure = event.target.firstElementChild;
        if (figure instanceof HTMLElement) {
          figure.style.transform = "";
          if (timer) {
            clearInterval(timer);
            timer = 0;
          }
        }
      }
    });
  }
}

index();
