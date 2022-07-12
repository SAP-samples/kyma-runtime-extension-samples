"use strict";

const qr = require("qrcode");
const { PassThrough } = require("stream");
const mime = require("content-type");

module.exports = {
  main: async function (event, context) {
    return new Promise((resolve, reject) => {
      const nowUTC = new Date().toISOString();

      const stream = getResponseStream("image/png", event.extensions.response);
      stream.on("finish", resolve);
      stream.on("error", reject);

      qr.toFileStream(stream, nowUTC);
    });
  },
};

function getResponseStream(ct, response) {
  if (ct) {
    setResponseType(ct, response);
  }

  const rs = new PassThrough();
  rs.pipe(response, { end: true });

  return rs;
}

function setResponseType(ct, response) {
  mime.parse(ct);
  response.set("content-type", ct);
}