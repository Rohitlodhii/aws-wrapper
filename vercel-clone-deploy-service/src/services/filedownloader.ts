import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { storage } from "../lib/storage.js";
import path from "path";
import fs, { createWriteStream } from 'fs'
import { promisify } from "util";
import { pipeline } from "stream";


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const streampipe = promisify(pipeline)

export async function downloadS3Folder(prefix : string){
    const listCommand = new ListObjectsV2Command({
        Bucket : "rohitvercelclone",
        Prefix : prefix
    }) 

    const allFiles = await storage.send(listCommand)

    const allPromises = allFiles.Contents?.map( async ({Key}) => {
        if(!Key) return;

        const outputPath = path.join(__dirname , Key)
        const dirName = path.dirname(outputPath)

        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName , {
                recursive : true
            })
        }

        const getCommand = new GetObjectCommand({
            Bucket : "rohitvercelclone",
            Key
        })

        const { Body } = await storage.send(getCommand)

        if(Body && Body instanceof ReadableStream === false){
            const writeStream = createWriteStream(outputPath);
            await streampipe(Body as NodeJS.ReadableStream ,writeStream);
        }
    }) ?? []

    await Promise.all(allPromises)
}