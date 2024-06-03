import s3Client from "./utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const UploadObjHandler = async (event, context) => {
  try {
    const contentType = "image/jpeg";

    const command = new PutObjectCommand({
      Bucket: "nodejs-learning",
      Key: `thumbnail/thumbnail-${Date.now()}.jpeg`,
      ContentType: contentType,
    });
  
    const url = await getSignedUrl(s3Client, command);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
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
