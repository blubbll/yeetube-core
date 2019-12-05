//© 2019 by blubbll
("use strict");
const $ = require("node-global-storage");
const _ = require("./../!globals.js");
const m = require("./../!methods.js");
/////////////////////////////////////////////////////////////////////////////////////////
const r = m.getRoute(__dirname);
/////////////////////////////////////////////////////////////////////////////////////////
//https://shreyaschand.com/blog/2013/01/03/google-autocomplete-api/
_.app.get(r + "/getlink/:id", async (req, res, next) => {
  const r = await m.getLink(req.params.id);
  res.send(`${m.unicodeToChar(r)}`);
});
