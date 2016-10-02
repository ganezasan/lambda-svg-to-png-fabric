'use strict';

const aws = require('aws-sdk'),
  s3 = new aws.S3({ apiVersion: '2006-03-01' }),
  fabric = require('fabric').fabric,
  jsdom = require("jsdom"),
  md5 = require('md5'),
  env = require('./env.js');

module.exports.convert = (event, context, cb) => {
  const params = event.body;
  const svgString = jsdom.jsdom(decodeURIComponent(params.svgString)).body.innerHTML;
  const width = params.width;
  const height = params.height;

  const canvas = fabric.createCanvasForNode(width, height);

  fabric.loadSVGFromString(svgString , (objects, options) => {
    options.top = 0;
    options.left = 0;
    const svgGroups = fabric.util.groupSVGElements(objects, options);
    canvas.add(svgGroups).renderAll();
    const binaryData = canvas.nodeCanvas.toBuffer();
    const hash = md5(new Date().getTime());
    const imageKey = `${hash}.png`;

    s3.putObject(
      {
        'Bucket': env.BUKKET,
        'ACL': 'public-read',
        'Key': imageKey,
        'ContentType': 'image/png',
        'Body': binaryData
      },
      function (error) {
        if(error === null) {
          return cb(null,{
            status: 'success',
            msg: `https://s3-${env.REGION}.amazonaws.com/${env.BUKKET}/${imageKey}`,
          });
        } else {
          return cb(null, {
            status: 'error',
            msg: error
          });
        }
      }
    );
  });
};
