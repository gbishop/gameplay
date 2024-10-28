import { d as decode } from './url.js';
/* empty css       */

const links = [
	"./?v=x1cnJ_pOAdQ&s=0&t=789+%28BSD%29&i=200&e=1078&p=more",
	"./?v=SzQsHlLKgoE&s=0&t=The+Wonky+Donkey&i=300&e=1574&p=Play+more",
	"./?v=oyEl36GLTP0&s=0&t=number+blocks+1+numberss&g=t300c0q1t300c0q1t600c0q1t600c0q1t900c0q1&d=more&d=finish",
	"./?v=Q7fdSnyuN5s&s=0&t=Bluey+theme+song-+More&i=100&e=6128&p=More+Bluey",
	"./?v=h4UJlFOhyCM&s=0&t=CVI-+Wheels+on+The+Bus+prompt+%40+15&i=150&e=1120&p=Clap+Clap+Clap",
	"./?v=GzrjwOQpAl0&s=0&t=Wheels+on+the+bus-+CORE+Go&g=t241c0t53c0t528c0t104c0t813c0t158c0t927c0t217c0t1054c0t293c0&d=go",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+Bus+Coco&g=t425c0t153c0t581c0t312c0t727c0t466c0t881c0t620c0t1035c0&d=More+bus",
	"./?v=tQwVKr8rCYw&s=0&t=Encanto&g=t200c0q1t200c0q1t400c0q1t800c0q1t1000c0q1&d=More&d=Finished",
	"./?v=gghDRJVxFxU&s=7&t=Singing+Walrus+HELLO+core+word&g=t399c0t177c0t595c0t322c0t897c0&d=Hello%21",
	"./?v=tVlcKp3bWH8&s=0&t=Hello+Song&g=t160c0t160c1t254c0t316c1&d=Hello&d=How+are+you%3F",
	"./?v=inJO-Y8HtkU&s=600&t=Baby+Einstein%2Fwater&i=400&e=14049&p=help",
	"./?v=5oYKonYBujg&s=0&t=Old+McDonald-+Animal+ID&g=t160c0t310c1t510c2t640c3t840c4t960c5&d=Cow&d=Horse&d=Pig&d=Sheep&d=Duck&d=Rooster",
	"./?v=CyRNozcBASI&s=6&t=Play+Bubbles+%28GO+STOP%29&g=t409c0t146c1t624c0t278c1t848c0t416c1t1065c0t488c2t1194c3&d=STOP&d=GO&d=MORE&d=Finished",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+The+Cat+I+Love+My+White+Shoes&i=230&e=2361&p=more",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+the+Bus&i=100&e=2286&p=more",
	"./?v=0Losyoi_t84&s=0&t=Super+Simple+Duck+Songs+-+3+mins%2C+more%3F&i=1800&e=20526&p=more%3F",
	"./?v=HabRQmcUGd0&s=0&t=CVI+twinkle+twinkle%2C+prompt+%40+verse&g=t48c0t99c0t142c0&d=",
	"./?v=PY6RDXTEKDY&s=0&t=Pete+the+Cat+Falling+for+Autumn&i=250&e=2450&p=Hit+the+switch+for+more+story",
	"./?v=g15c8dGXHD8&s=0&t=We+are+going+to+school%3B+go%2FI+need%2Fdon%27t+need+that&g=t161c0t221c1t419c2t651c3t712c3t869c0&d=go&d=I+need+that%21&d=go+to+school&d=I+don%27t+need+that%21",
	"./?v=ylSsCCXRxkI&s=0&t=Classic+Disney+Songs&i=200&e=69700&p=More+Music",
	"./?v=QA48wTGbU7A&s=58.5&t=Cocomelon+-+Head%2C+Shoulders%2C+Knees+and+Toes+-+no+intro&g=t866c0t191c0t1011c0t305c0t1484q1&d=more&d=finished",
	"./?v=cPAbx5kgCJo&s=0&t=Moana%3A+How+Far+I%27ll+Go+%28MORE%29&i=300&e=1555&p=Do+you+want+more%3F",
	"./?v=0j6AZhZFb7A&s=0&t=5+Little+Monkeys+-+More&i=250&e=1101&p=more",
	"./?v=OwRmivbNgQk&s=0&t=Let%27s+Go+To+The+Zoo-+CORE+Go&g=t101c0t64c0t364c0t125c0t617c0t188c0t852c0t251c0t1076c0t314c0t1319c0t377c0t1618c0t438c0&d=go",
	"./?v=yomkyCFHfHM&s=65.3&t=Pete+the+Cat+Fall+Into+Autumn+%22What+Happens+Next%22&g=t974c0t571c0t1223c0t1018c0t1502c0t1249c0t1736c0t1857c0t2087c0t2588q1b2&d=What+happens+next%3F&d=I%27m+all+done.&d=Let%27s+read+again%21",
	"./?v=2S__fbCGwOM&s=0&t=Ants+Go+Marching+One+By+One&i=80&e=2320&p=More",
	"./?v=R1Hrkqep8nU&s=7&t=Me-Super+Simple+Songs+%28ME%29&g=t347c0t102c0t400c0t579c0t453c0t681c0t830c0t783c0t1031c0t883c0&d=me",
	"./?v=pnZbiKKydWU&s=0&t=Moana+How+far+I%27ll+go&i=120&e=1572&p=More+song",
	"./?v=DyOO1V8i7oQ&s=0&t=Cocomelon+Wheels+on+the+Camper&g=t315c0t153c0t468c0t382c0t622c0t574c0t774c0&d=More+music",
	"./?v=Ytxnyf3sJSQ&s=0&t=Rocking+in+My+School+Shoes+Pete+the+Cat+%28In%29&g=t56c0t50c0t112c0t299c0t166c0t348c0t556c0t401c0t609c0t478c0t714c0t613c0t766c0t665c0t1096c0t718c0t1150c0t817c0t1205c0t870c0t1256c0t1046c0t1310c0t1099c0t1363c0&d=in",
	"./?v=93lrosBEW-Q&s=0&t=Shiny+Moana+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1t1200c0q1&d=more&d=finish",
	"./?v=r4KTqce-9Z0&s=0&t=You%27re+welcome+Disney+for+N&i=250&e=1590&p=Look+to+play",
	"./?v=lHhheCf0G1I&s=0&t=Hot+Dog+Mickey+Letters&g=t169c0t65c1t276c2t159c3t513c4&d=pluto+p&d=goofy+g&d=tootles+t&d=donald+d&d=mickey+m",
	"./?v=pnQR7w0fyTE&s=90&t=Mickey+Mouse+Clubhouse+Daisy+Bo+Peep+%22more%22&g=t1084c0t342c0t1571c0t616c0t1744c0t736c1&d=more&d=all+done",
	"./?v=GrKQvyXpNgc&s=0&t=Taylor+Swift+Cruel+Summer&i=150&e=1806&p=More+Music",
	"./?v=Yp5nPGWWMh4&s=0&t=Encanto&i=180&e=2950&p=+",
	"./?v=L0MK7qz13bU&s=0&t=Let+It+Go%3A+Frozen+%2810+seconds-more+music%29&i=100&e=2430&p=more+music",
	"./?v=LuGMCB2sjkU&s=0&t=CVI+The+Very+Hungry+Caterpillar&g=t100c0t100c0t200c0t200c0t300c0t300c0t400c0t400c0t500c0t500c0t600c0t600c0t700c0t700c1&d=more&d=finished",
	"./?v=MeRIpU4Ibo4&s=0&t=number+blocks+0+numberss&g=t300c0q1t300c0q1t600c0q1t600c0q1&d=more&d=finish",
	"./?v=8xg3vE8Ie_E&s=0&t=Taylor+Swift+Love+Story&g=t150c0q1t150c0q1t450c0q1t450c0q1t1050c0q1&d=more&d=finished",
	"./?v=e_04ZrNroTo&s=0&t=Wheels+on+the+Bus+%22more%22&i=100&e=2286&p=More",
	"./?v=0lS9btv3GVk&s=5&t=10+Apples+%28MORE+ON%29&g=t130c0t37c1t289c1t132c1t505c1t375c2&d=ON&d=MORE+ON&d=FINISHED",
	"./?v=yWirdnSDsV4&s=0&t=Wheels+on+the+bus+super+simple+songs&g=t150c0t200c0t300c0t500c0t600c0t920c1&d=Turn+on&d=Turn+off",
	"./?v=SWvBAQf7v8g&s=0&t=Usher%27s+ABC+in+Action+Song&g=t254c0t215c0t462c0t402c0&d=Play+More+Music",
	"./?v=EYb2QfjKe_4&s=0&t=You%27ve+Got+a+Friend+in+Me+%28ME%29&g=t172c0t169c0t340c0t373c0t523c0t528c0t607c0&d=me",
	"./?v=XqZsoesa55w&s=0&t=Baby+Shark+-+Pinkfong+Version&i=250&e=1360&p=+more",
	"./?v=IMEwzzyBP7w&s=0&t=Mickey+Mouse+Club+House&i=100&e=836&p=More",
	"./?v=5zXtxtrGKEw&s=0&t=Halloween+Want+More&i=200&e=33700&p=want+more",
	"./?v=cPAbx5kgCJo&s=0&t=Moana-+How+Far-+Prompt+%40+20%2F30&g=t212c0t199c0t418c0t406c0t710c0t703c0&d=",
	"./?v=Ec1cz_jHQM8&s=0&t=GO+AWAY+scary+monster&g=t318c0t48c0t409c0t138c0t457c0t361c0t597c1&d=go+away&d=all+done",
	"./?v=JWCZ0VbfjMk&s=0&t=Core+HELP&g=t213c0t87c0t368c0t244c0t516c0t485c0t668c0t724c0t822c0t979c1&d=HELP&d=ALL+DONE",
	"./?v=Qx91ff77yzM&s=5&t=Friend+Like+Me+%28ME%29&g=t458c0t100c0t654c0t791c0t720c0&d=me",
	"./?v=Mc9My7TnxFU&s=0&t=brown+bear+%2F+more+please&g=t152c0t148c0t282c0t260c0t417c0t359c0t552c0t471c0t667c0t575c0t803c0&d=more+please",
	"./?v=YA2YZx_rcCY&s=0&t=1+to+10+CVI&g=t93c0t59c1t165c2t139c3t256c4t246c5t362c6t367c7t498c8&d=2&d=3&d=4&d=5&d=6&d=7&d=8&d=9&d=10",
	"./?v=-0icbqvmehs&s=0&t=Wheels+on+the+Bus-Pete+the+Cat+%28Go%29&i=70&e=1537&p=Go",
	"./?v=hqzvHfy-Ij0&s=0&t=twinkle+twinkle+cocomelon&i=200&e=1953&p=more",
	"./?v=rHtq5GIIUV8&s=0&t=Halloween+Songs+-+Core+Words%2C+Numbers&g=t280c0t190c1t446c2t342c3t714c4t602c5t1011c4t813c0t1184c1t1003c2t1376c3t1293c6t1532c6t1437c6t1673c6t1580c6t1814c6t1721c6t1955c6t1862c6t2106c7&d=4&d=3&d=2&d=1&d=5&d=more&d=turn&d=goodnight",
	"./?v=bvWRMAU6V-c&s=0&t=Encanto+-+We+Don%27t+Talk+About+Bruno&g=t246c0t321c0t434c0t556c0t619c0t742c0t871c0t1003c0t1122q1&d=more&d=finished",
	"./?v=9Wsod3lPlYY&s=0&t=No%2C+David&g=t98c0t45c0t138c0t108c0t236c1t174c2t338c3t304c4t394c5t363c6t437c7t462c8t528c9t474c10&d=No&d=quiet&d=don%27t&d=go&d=down&d=stop&d=put&d=not&d=no&d=yes&d=I+love+you",
	"./?v=xoyEDrMDirA&s=0&t=Red+Light%2C+Green+Light+%28stop%29&g=t130c0t35c0t167c0t180c0t204c0t216c0t342c0t363c0t450c0t419c0t476c0t489c0t513c0&d=Stop",
	"./?v=N6uDZw7-3z8&s=0&t=Mickey+Mouse+Clubhouse+-+Theme&g=t100c0q1t100c0q1t200c0q1t200c0q1t300c0q1t300c0q1t400c0q1&d=More&d=All+done",
	"./?v=79DijItQXMM&s=0&t=You%27re+Welcome-+Moana%2C+Core+Words%2C+Some+Gestalts&g=t25c0t16c1t33c1t37c2t101c3t98c4t165c5t127c6t273c7t199c8t539c9t291c10t619c11t418c12t783c13t438c14t931c11t487c15t1138c1&d=You+are+saying&d=Thank+you&d=What%3F+No+No+No&d=see&d=How+do+you+feel%3F&d=Open&d=Yes%2C+it%27s+me&d=say&d=it%27s+good+%28ok%29&d=let%27s+have+fun&d=What+can+I+say&d=it%27s+good&d=go+on+and+on&d=look+where&d=look+at+that&d=I+gotta+go",
	"./?v=79DijItQXMM&s=0&t=Moana&i=150&e=1690&p=More+music",
	"./?v=e_04ZrNroTo&s=0&t=Cocomelon+Wheels+on+the+Bus+-+more&i=200&e=2286&p=more",
	"./?v=cPAbx5kgCJo&s=0&t=Moana-+Angelica&i=120&e=1555&p=Hit+the+switch+for+more+music",
	"./?v=lHhheCf0G1I&s=4&t=Mickey+Mouse+Clubhouse+Hot+Dog&i=130&e=867&p=+",
	"./?v=0gyI6ykDwds&s=0&t=We%27re+Going+On+a+Bear+Hunt&g=t257c0t173c0t212c0t348c0t352c0t412c0t482c0t560c0t596c0t693c0t746c0t885c0t908c0t962c0t1038c0t1118c1t1123c0t1600c0t1198c0&d=Turn+the+page&d=Turn+the+page+-+sssshh%21",
	"./?v=jp-D1eX1oaY&s=0&t=Candy+corn+countdown&i=200&e=1242&p=More+Candy+corn",
	"./?v=yOHoHrwwRyk&s=0&t=Thomas+the+Tank+Engine&i=150&e=7113&p=Go",
	"./?v=L0MK7qz13bU&s=0&t=Frozen-+More&i=250&e=2426&p=More+Elsa",
	"./?v=b2rBhpVDzO8&s=0&t=Sesame+Street-Go&i=60&e=474&p=GO",
	"./?v=erteyzvS9Ds&s=0&t=Super+Simple+One+Little+Finger&i=200&e=1494&p=More+Music",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+I+Love+My+White+Shoes+%28Mixed+WH+%3Fs%29&g=t235c0t328c1t652c2t656c3t1602c4&d=Look%21+Pete+loves+his+white&d=What+did+Pete+step+in%3F&d=What+color+are+Pete%27s+shoes%3F&d=Pete%27s+shoes+are+not+clean.+They+are&d=How+does+Pete+feel%3F",
	"./?v=Va1rfqpF35Q&s=5&t=Who+is+at+the+door%3F+Halloween&g=t337c0t452c0t784c0t909c0t1294c0t948c1t1390c2&d=Who+is+it%3F&d=Oh+No%21++It%27s+a+ghost&d=The+End",
	"./?v=-GSnmRZlgc4&s=0&t=Pete+I+Love+My+White+Shoes+%28%22goodness%2C+no%22%29&g=t633c0t365c0t1021c0t821c0&d=Goodness%2C+no%21",
	"./?v=TeQ_TTyLGMs&s=0&t=Do+-+Frozen+%28Do+You+Want+to+Build+a+Snowman%3F%29&g=t101c0t211c0t373c0t1357c0&d=Do",
	"./?v=GoSq-yZcJ-4&s=0&t=Walking+in+the+Jungle&i=150&e=2041&p=Play",
	"./?v=tXpGpix2_vw&s=0&t=Flash+forward+superhero+book&g=t300c0q1t300c0q1t600c0q1&d=more&d=finish",
	"./?v=eeUz08JdIC4&s=0&t=Sesame+Street+Baby+Shark+Prompt+%40+20&i=200&e=1691&p=+",
	"./?v=bBeZSuHI4Qc&s=0&t=What+Else+Can+I+Do%3F+Encanto+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1&d=more&d=finish",
	"./?v=GR2o6k8aPlI&s=0&t=Baby+Shark%3A+More+Please&i=200&e=1897&p=More+Please",
	"./?v=_HbEejSqE9Y&s=38&t=Baby+Einstein+Objects-Visual+Stimulation&g=t453c0t320c0t750c0t560c0t1005q1&d=I+want+more%21&d=All+done%21",
	"./?v=1a2Smau__Dk&s=0&t=Giraffes+Can%27t+Dance&i=250&e=2947&p=Press+more+to+read+the+book",
	"./?v=ieCxOOY0RTs&s=0&t=Storybots+Days+of+the+week+%28more%29&i=150&e=767&p=More+Storybots",
	"./?v=jKKrfr4To14&s=0&t=Waiting+On+A+Miracle+Encanto+S1&g=t400c0q1t400c0q1t800c0q1t800c0q1&d=more&d=finish",
	"./?v=gbib1qt-YSg&s=0&t=Llama+Llama+Time+to+Share+Core+Words&g=t265c0t75c1t378c2t201c3t512c4t323c5t623c2t533c6t723c7t575c8t888c9t783c10t1035c2t995c11&d=who&d=look&d=they+play&d=open&d=he+sad&d=he+make&d=what+do&d=she+take&d=not+like&d=he+feel+sad&d=do+different&d=they+like",
	"./?v=oWgTqLCLE8k&s=0&t=Can%27t+Stop+the+Feeling+Trolls&i=150&e=1448&p=more",
	"./?v=a3ugFqLSoQs&s=0&t=Baby+Einstein+get+up+and+go&i=450&e=16256&p=yes",
	"./?v=DEHBrmZxAf8&s=0&t=Zoom+Zoom+%28MORE%29&i=200&e=1051&p=Do+you+want+more%3F",
	"./?v=e-ORhEE9VVg&s=0&t=Taylor+Swift+Blank+Space&g=t150c0q1t150c0q1t450c0q1t450c0q1t1050c0q1t950c0q1&d=more&d=finished"
];

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
    console.log(event);
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

if (location.search) {
  const game = decode(new URL(location.href));
  console.log({ game });
  play(game);
} else {
  index();
}
//# sourceMappingURL=find.js.map
