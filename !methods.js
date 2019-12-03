//© 2019 by blubbll
("use strict");
const $ = require("node-global-storage");
const _ = require("./!globals.js");
//////////////////////////////////////////////////////////////////////////////////////////

//common METHODS
{
  //calc api route by folder structure
  const getRoute = dir => {
    return `/${dir
      .split("/")
      .slice(1)
      .join("/")}`.replace(/^[\W]app/, "");
  };

  const getSugg = async (l, q) =>
    new Promise(async (resolve, reject) => {
      const cKey = `sugg_{l}_${q}`;

      //if not cached
      if (!$.get(cKey)) {
        var url = `http://suggestqueries.google.com/complete/search?client=youtube&cp=1&ds=yt&q=${q}&hl=${l}&format=5&alt=json&callback=?`;

        let Agent = new _.HttpProxyAgent({
          host: process.env.PROXYMESH_HOST,
          port: process.env.PROXYMESH_PORT,
          auth: [process.env.PROXYMESH_USER, process.env.PROXYMESH_PASS].join(
            ":"
          )
        });
        console.log(Agent);
        _.request(
          {
            uri: url,
            agent: Agent,
            method: "GET",
            timeout: 3000,
            followRedirect: true,
            maxRedirects: 10,
            encoding: "latin1"
          },
          async (error, response, body) => {
            if (body) {
              let suggs = [];
              body = `[${body.split("[[")[1].split("]]")[0]}]`.split(",");
              for (const sugg of body) {
                sugg !== "0]" &&
                  sugg.slice(2, -1).length > 0 &&
                  suggs.push(sugg.slice(2, -1));
              }

              suggs = JSON.stringify(suggs)
                .normalize()
                .normalize()
                .slice(2, -1);

              //set cached suggest
              $.set(cKey, suggs);

              resolve(suggs);
            } else {
              setTimeout(resolve(await getSugg(l, q)), 999);
            }
          }
        );
      } else {
        resolve($.get(cKey));
      }
    });

  const rnd = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  function isArray(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  Array.prototype.remByVal = function(val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  /*const newProxy = () =>
    new Promise(async (resolve, reject) => {
      {
        const proxylist = require("proxylist");
        proxylist.main().then(async all => {
          const prx = all[rnd(0, all.length)];
          if (prx && `${prx.split(":")[0]}${prx.split(":")[1]}`.length > 5) {
            $.set("prx", { ip: prx.split(":")[0], port: prx.split(":")[1] });
            resolve();
          } else resolve(await newProxy());
        });
      }
    });*/

  /*const newAgent = (first) =>
    new Promise(async (resolve, reject) => {
      let tp = $.get("toragent");
      if (!first && $.get("toragent")) resolve(tp.rotateAddress());
      else
        _.TorAgent.create(false, (err, agent) => {
          if (err) reject(err);
          else resolve(agent);
        });
    });*/

  const unicodeToChar = text => {
    return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
  };
  //export
  module.exports = {
    unicodeToChar,
    getRoute,
    rnd,
    getSugg
  };
}
