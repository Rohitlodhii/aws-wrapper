
import fs from 'fs'
import { storage } from "../lib/storage.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";






export const uploadFile =async ( fileName : string , localFilePath : string )=> {
    const fileContent = fs.readFileSync(localFilePath)
    const command = new PutObjectCommand({
        Bucket : 'rohitvercelclone',
        Key : fileName ,
        Body : fileContent
    })
    const respone = await storage.send(command)
    
    return respone
}