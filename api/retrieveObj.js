import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./utils/s3Client.js";

const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "nodejs-learning",
    Key: key,
  });

  const objUrl = await getSignedUrl(s3Client, command);

  return { objUrl };
};

export const GetObjHandler = async (event, context) => {
  try {
    const key = event.pathParameters.key;
    const { objUrl } = await getObjectUrl(key);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Get Obj Successfully",
        objUrl: objUrl
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
