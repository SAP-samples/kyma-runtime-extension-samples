"use strict";

const AWS = require("aws-sdk");

module.exports = {
  main: async function (event, context) {
    let s3 = new AWS.S3({
      endpoint: readEnv("S3_ENDPOINT"),
      accessKeyId: readEnv("S3_ACCESSKEY_ID"),
      secretAccessKey: readEnv("S3_SECRET"),
    });

    let body = JSON.stringify(event.data);

    let params = {
      Bucket: readEnv("S3_BUCKET"),
      Key: Date.now().toString(),
      Body: body,
    };
    try {
      return await s3.upload(params).promise();
    } catch (e) {
      console.log(e);
      return e;
    }
  },
};

function readEnv(env = "") {
  return process.env[env] || undefined;
}