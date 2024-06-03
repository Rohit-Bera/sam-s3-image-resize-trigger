import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials:{
        accessKeyId: "your-aws-access-key",
        secretAccessKey: "your-aws-secret-access-key",
    }
})

export default s3Client
