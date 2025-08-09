import fs from 'fs'


import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { storage } from '../lib/storage.js';
import { getAllFiles } from '../utils/getFiles.js';
import { uploadFile } from './uploadFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function distUploadToS3(id:string) {

    const outputDir = path.join(__dirname , `output/${id}/dist`);


     const files = getAllFiles(outputDir)
    
    const uploadResults = await Promise.all(
      files.map(async (file) => {
       const relativePath = file
      .slice(outputDir.length + 1)
      .split(path.sep)
      .join('/');

        const s3Key = `output/${id}/dist/${relativePath}`;  // 🟢 wrap files under a project folder

        const response = await uploadFile(s3Key, file);
        return {
          file,
          response,
        };
      })
    );

    return uploadResults 


    
}