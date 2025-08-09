import express from 'express'
import { generateRandomId } from '../../utils/random_id.js'
import {simpleGit} from 'simple-git'
import path from 'path'
import { getAllFiles } from '../../utils/getFiles.js'
import { uploadFile } from '../../services/uploadfiles.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { addToQueue } from '../../services/uploadredis.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const gitRouter = express.Router()


gitRouter.get('/' , (req,res)=>{
    res.send("Git Server Running ")
})

gitRouter.post('/deploy', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing repoUrl' });
  }

  const id = generateRandomId();
  const outputDir = path.join(__dirname , `output/${id}`);

  try {
    await simpleGit().clone(repoUrl, outputDir);
    
    const files = getAllFiles(outputDir)
    
     const uploadResults = await Promise.all(
      files.map(async (file) => {
       const relativePath = file
      .slice(outputDir.length + 1)
      .split(path.sep)
      .join('/');

        const s3Key = `output/${id}/${relativePath}`;  // 🟢 wrap files under a project folder

        const response = await uploadFile(s3Key, file);
        return {
          file,
          response,
        };
      })
    );

    const newLength = await addToQueue(id);

    return res.json({ uploads: uploadResults  , redisId : newLength});


  } catch (error) {
    console.error("Failed to clone the repository:", error);
    return res.status(500).json({ error: 'Failed to clone repository' });
  }
});

export default gitRouter