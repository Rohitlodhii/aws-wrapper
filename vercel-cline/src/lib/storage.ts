
import { S3Client } from '@aws-sdk/client-s3'
import { configDotenv } from "dotenv";
configDotenv()

console.log(process.env.AWS_ACCESS_KEY)

export const storage = new S3Client({
    region :process.env.AWS_REGION!,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})