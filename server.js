//© 2019 by blubbll
("use strict");
///////////////////////////////////////////////////////////////////////////
//DEPLOY
///////////////////////////////////////////////////////////////////////////
(async () => {
  const script = "!glitch-deploy.js";
  if (process.env.PROJECT_DOMAIN) {
    const deployfile = ":deploying:";
    require("download")(
      "https://raw.githubusercontent.com/blubbll/glitch-deploy/master/glitch-deploy.js",
      __dirname,
      {
        filename: script
      }
    ).then(() => {
      deployProcess();
    });
    const deployProcess = async () => {
      const deploy = require(`./${script}`);
      const deployCheck = async () => {
        //console.log("🐢Checking if we can deploy...");
        if (_.fs.existsSync(`${__dirname}/${deployfile}`)) {
          console.log("🐢💥Deploying triggered via file.");
          _.fs.unlinkSync(deployfile);
          await deploy({
            ftp: {
              password: process.env.DEPLOY_PASS,
              user: process.env.DEPLOY_USER,
              host: process.env.DEPLOY_HOST
            },
            clear: 0,
            verbose: 1,
            env: 1
          });
          _.request(
            `https://evennode-reboot.glitch.me/reboot/${process.env.DEPLOY_TOKEN}/${process.env.PROJECT_DOMAIN}`,
            (error, response, body) => {
              console.log(error || body);
            }
          );
          require("child_process").exec("refresh");
        } else setTimeout(deployCheck, 9999); //10s
      };
      setTimeout(deployCheck, 999); //1s
    };
  } else require(`./${script}`)({ env: true }); //apply env on deployed server
})();
///////////////////////////////////////////////////////////////////////////
const $ = require("node-global-storage");
const _ = require("./!globals.js");
const m = require("./!methods.js");
//////////////////////////////////////////////////////////////////////////////////////////

//puppeteer = require('puppeteer-firefox');

//API
require("./api");

let zombieOptions = {
  userAgent: "Opera(Linux)",
  debug: false,
  waitDuration: 30000,
  silent: true,
  headers: {
    "accept-language": "en-US8,en;q=0.9,en-US;q=0.8,en;q=0.7"
  }
};

const aeon = {
  getThumb(args) {
    var id = _.getYouTubeID(args.url);
    switch (args.size) {
      case "default":
        return {
          url: "http://img.youtube.com/vi/" + id + "/default.jpg",
          width: 120,
          height: 90
        };
        break;
      case "medium":
        return {
          url: "http://img.youtube.com/vi/" + id + "/mqdefault.jpg",
          width: 320,
          height: 180
        };
        break;

      case "high":
        return {
          url: "http://img.youtube.com/vi/" + id + "/hqdefault.jpg",
          width: 480,
          height: 360
        };
        break;
    }
  }
};

// http://expressjs.com/en/starter/static-files.html
_.app.use(_.express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
_.app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// http://expressjs.com/en/starter/basic-routing.html
_.app.get("/views/*", function(req, res) {
  const path = __dirname + req.url;
  if (_.fs.existsSync(path)) {
    res.sendFile(path);
  }
});

process.setMaxListeners(Infinity);

// listen for requests :)
const listener = _.app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

//ytdl.getInfo('https://www.youtube.com/watch?v=W4owQV95J9c', function(err, info) {

//console.log(info);

//});

let browser = {};
const pevents = [
  "console",
  "dialog",
  "load",
  "domcontentloaded",
  "error",
  "pageerror",
  "frameattached",
  "framenavigated",
  "framedetached",
  "request",
  "requestfinished",
  "requestfailed",
  "response"
];
(async () => {
  /*const mobileUA = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1`;
    // Create headless session
    browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService',
            `--user-agent=${mobileUA}`,
        ]
    });*/
  //const browser = await puppeteer.launch();
  console.log("browser ready");
})();

_.app.get("/api/getLink/:v", async (req, res) => {
  /* const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    // Open a page, than close
    page.goto(`https://m.youtube.com/watch?v=bXW5MaOSOIw`);
    await page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
    // Log puppeter page notifications
    pevents.forEach((peventName) => {
        page.on(peventName, async (plistenerFunc) => {

            if (peventName === 'response' || peventName === 'request') {
                //console.log(plistenerFunc._url);
              //console.log(plistenerFunc.body()||'');
            }
        });
    });

    var url = '';
  
      const forcePlay= async() => {
      if (url) {
          //console.log("url: " + url);
          page.close();
      } else {
          console.log("retrying...");
          //let html = await page.evaluate(() => document.body.innerHTML);
          
          await page.click("#movie_player > div.html5-video-container > video");
      }};
    forcePlay();
    //await page.close();
    // Open a page, than close
    await page.goto(`https://m.youtube.com/watch?v=bXW5MaOSOIw`, {
        waitUntil: ['networkidle2', 'load', 'domcontentloaded'],
        timeout: 100000
    });
    await page.close();
    //await browser.close();
    */

  const puppeteer = require("puppeteer-fx");

  (async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto("https://mozilla.github.io/arewefastyet-speedometer/2.0/");

    await page.evaluate(
      'document.querySelector("section#home div.buttons button").click()'
    );
  })();
});
