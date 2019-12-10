//© 2019 by blubbll
("use strict");
const $ = require("node-global-storage");
const _ = require("./../!globals.js");
const m = require("./../!methods.js");
/////////////////////////////////////////////////////////////////////////////////////////
const r = m.getRoute(__dirname);
/////////////////////////////////////////////////////////////////////////////////////////
//https://shreyaschand.com/blog/2013/01/03/google-autocomplete-api/
_.app.get(r + "/complete/:l/:q", async (req, res, next) => {
  res.send(await m.getSugg(req.params.l, req.params.q));
});
