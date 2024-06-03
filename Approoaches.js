// This is just a trial & error file
//  I have kept this code , because i might need important things in future
// try 1
import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const putObject = async (filename, contentType, body) => {
  const command = new PutObjectCommand({
    Bucket: "nodejs-learning",
    Key: filename,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command);

  let blobData = new Blob([new Uint8Array(body)], { type: "image/jpeg" });
  const result = await fetch(url, {
    method: "PUT",
    body: blobData,
  });

  return { url, blobData };
};

export const UploadObjHandler = async (event, context) => {
  try {
    const body = event.body;

    const { url, blobData } = await putObject(
      `thumbnail-${Date.now()}.jpg`,
      "image/jpeg",
      body
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { url: url, blob: blobData , body: body  },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


//  try 2

import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const putObject = async (filename, contentType) => {
    const command = new PutObjectCommand({
      Bucket: "nodejs-learning",
      Key: filename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);

    return { url };
};

export const UploadObjHandler = async (event, context) => {
  try {
    const body = event.body;

    const { url } = await putObject(
      `thumbnail-${Date.now()}.jpg`,
      "image/jpeg"
    );

    const blobObj = new Blob([body], {
      type: "application/octet-stream",
    });

    const obj = new FormData();

    obj.append("myfile", blobObj);

    await fetch(url, {
      method: "PUT",
      body: obj,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { url: url },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 3

import S3 from 'aws-sdk/clients/s3.js';

const s3 = new S3({
  accessKeyId: "your-aws-access-key",
  secretAccessKey: 'your-aws-secret-access-key',
  region:'us-east-1',
  signatureVersion: 'v4',
});

export const UploadObjHandler = async (event, context) => {
  try{
    const body = Buffer.from(event.body , 'base64');

    const key= `thumbnail-${Date.now()}.jpeg`;
  
    const params = {
      Bucket: "nodejs-learning",
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    };
  
    const uploadUrl = await s3.getSignedUrlPromise("putObject" , params);
  
    await fetch(uploadUrl, {
      method: "PUT",
      body: body,
    });
  
    // or

    // const buffer = Buffer.from(body, 'base64');
  
    // const result = await s3.upload({
    //   Bucket: "nodejs-learning",
    //   Key: key,
    //   Body: buffer,
    //   ACL: 'public-read',
    //   ContentType: 'image/jpeg',
    // }).promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { uploadUrl : uploadUrl },
      }),
    };
  }catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 4

import S3 from 'aws-sdk/clients/s3.js';

const s3 = new S3({
  accessKeyId: "your-aws-access-key",
  secretAccessKey: 'your-aws-secret-access-key',
  region:'us-east-1',
  signatureVersion: 'v4',
});

export const UploadObjHandler = async (event, context) => {
  try{
    const body = Buffer.from(event.body , 'base64');

    const key= `thumbnail-${Date.now()}.jpeg`;
  
    const params = {
      Bucket: "nodejs-learning",
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    };
  
    await s3.putObject(params).promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
      }),
    };
  }catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 5 (binary buffer)

import S3 from "aws-sdk/clients/s3.js";
import axios from "axios";

const s3 = new S3({
  accessKeyId: "your-aws-access-key",
  secretAccessKey: "your-aws-secret-access-key",
  region: "us-east-1",
  signatureVersion: "v4",
});

export const UploadObjHandler = async (event, context) => {
  try {
    // const body = Buffer.from(event.body, "base64");
    const body = event.body;

    const key = `thumbnail-${Date.now()}.jpeg`;

    const params = {
      Bucket: "nodejs-learning",
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: body,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { uploadUrl: uploadUrl, result: response },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 6
import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
import fs from "fs";
import { type } from "os";

export const UploadObjHandler = async (event, context) => {
  try {
    const body = event.body;
    // Convert the binary string to a base64 encoded string
    const base64encoded = Buffer.from(body, 'latin1').toString('base64');

    // // Convert the base64 encoded string to a buffer
    const buffer = Buffer.from(base64encoded, 'base64');

    // const thumb = await Jimp.read(buffer);

    // const thumbnail = await thumb
    //   .resize(200, 200)
    //   .quality(60)
    //   .getBufferAsync(Jimp.MIME_JPEG);

    // const command = new PutObjectCommand({
    //   Bucket: "nodejs-learning",
    //   Key: `resized-thumbnail-${Date.now()}.jpg`,
    //   ContentType: "image/jpg",
    //   Body: buffer,
    // });

    // await s3Client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: {
          body: body,
          type: typeof body,
        },
      }),
      raw: {
        base64Encoded: base64encoded,
        buffer: buffer,
      }
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 7
import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";

const putObject = async (filename, contentType) => {
  const command = new PutObjectCommand({
    Bucket: "nodejs-learning",
    Key: filename,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command);

  return { url };
};

export const UploadObjHandler = async (event, context) => {
  try {
    const img = Buffer.from(event.body, "latin1").to('base64');

    const contentType = "image/jpeg";

    const { url } = await putObject(`thumbnail-${Date.now()}.jpg`, contentType);

    await fetch(url, {
      method: "PUT",
      body: img,
      headers: {
        "Content-Type": contentType,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { url: url, imgType: typeof img , ImgVal: img},
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};


// try 8
import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";

const putObject = async (filename, contentType) => {
  const command = new PutObjectCommand({
    Bucket: "nodejs-learning",
    Key: `thumbnail/${filename}`,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command);

  return { url };
};

export const UploadObjHandler = async (event, context) => {
  try {
    const contentType = "image/jpeg";
    // const body = event.body;

    // const image = './assets/img.jpeg';

    // const img = await Jimp.read(image);

    // const resizedImg = img.resize(200, 200).quality(60);

    // const bufferImg = await resizedImg.getBufferAsync(Jimp.MIME_JPEG);
    // console.log('✌️bufferImg --->', bufferImg);

    const { url } = await putObject(`thumbnail-${Date.now()}.jpeg`, contentType);

    // const body = Buffer.from(event.body , 'binary');

    // await fetch(url, {
    //   method: "PUT",
    //   body: body,
    // });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        responseStatus: "Success",
        message: "Object uploaded successfully",
        result: { url: url },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessage: err.message,
        errStack: err.stack,
      }),
    };
  }
};
