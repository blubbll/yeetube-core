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

  const mobileUA = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1`;

  const browser = new _.zombie({
    userAgent: mobileUA,
    debug: false,
    waitDuration: 30000,
    silent: true,
    headers: {
      "accept-language": "en-US8,en;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  });

  const getLink = async id =>
    new Promise(async (resolve, reject) => {
      const cKey = `link_${id}`;

      //if not cached
      if (!_.cache.has(cKey)) {
        var url = `https://m.youtube.com/watch?v=${id}`;

        console.log(`Getting link for ${id}...`);
        _.request(
          {
            uri: url,
            agent: _.pAs,
            method: "GET",
            timeout: 3000,
            followRedirect: true,
            maxRedirects: 10,
            encoding: "latin1",
            headers: {
              "cache-control": "no-cache",
              pragma: "no-cache",
              "upgrade-insecure-requests": "1",
              "user-agent": mobileUA
            },
            referrer: "https://www.google.com/"
          },
          async (error, response, body) => {
            
            if (response.statusCode === 200) {
              let $ = _.cheerio.load(body);

              var window = {};
              let ytInitialPlayerConfig = {};
              const loadPlayerConfig = async cfg => {
                setConfig(cfg.args);
              };
              eval($("script")[8].children[0].data);

              const setConfig = async cfg => {
                //console.log(cfg.url_encoded_fmt_stream_map)
                const v = {
                  id: id,
                  author: cfg.author,
                  captionUrl: cfg.iv_invideo_url,
                  snap: {
                    default: cfg.iurl,
                    low: cfg.thumbnail_url,
                    medium: cfg.iurlsq,
                    high: cfg.iurlmq
                  },
                  title: cfg.title,
                  ts: cfg.timestamp,
                  formats: JSON.parse(cfg.player_response).streamingData.formats
                };

                if (v.formats[0].cipher) {
                  console.log(`Getting link for premium vid ${id}...`);

                  browser.visit(url);

                  await browser.wait();
                  await browser.clickLink(
                    "#movie_player > div.ytp-cued-thumbnail-overlay > button > div"
                  );
                  console.log(browser.assert($("video").src));
                  browser.destroy()

                  resolve("premium");
                } else {
                  console.log(`Got link for ${id}...`);
                  _.cache.set(cKey, v.formats);
                  console.log(v.formats);
                  resolve(v.formats);
                }
              };
            } else {
              console.log(body)
              console.log(`Failed to get link for ${id} Retrying...`);
              setTimeout(resolve(await getLink(id)), 2999);
            }
          }
        );
      } else {
        resolve(_.cache.get(cKey));
      }
    });

  const getSugg = async (l, q) =>
    new Promise(async (resolve, reject) => {
      const cKey = `sugg_{l}_${q}`;

      //if not cached
      if (!$.get(cKey)) {
        var url = `http://suggestqueries.google.com/complete/search?client=youtube&cp=1&ds=yt&q=${q}&hl=${l}&format=5&alt=json&callback=?`;
        _.request(
          {
            uri: url,
            agent: _.pA,
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
    getLink,
    rnd,
    getSugg
  };
}
