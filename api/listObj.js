import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3Client from "./utils/s3Client.js";

const getObject = async() => {
    const command = new ListObjectsV2Command({
        Bucket: "nodejs-learning",
      });

    const allObjects = await s3Client.send(command);

    return {allObjects}
}

export const ListObjHandler = async (event, context) => {
  try {

    const { allObjects } = await getObject();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        responseStatus: "Success",
        message: "hello world",
        objects: allObjects,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        responseCode: "Failure",
        errMessgae: err.message,
        errStack: err.stack,
      }),
    };
  }
};
