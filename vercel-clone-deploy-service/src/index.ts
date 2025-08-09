import express from 'express'
import { redisClient } from './lib/redis.js'
import { downloadS3Folder } from './services/filedownloader.js';
import { buildProject } from './services/buildproject.js';
import { distUploadToS3 } from './services/copydist.js';


const app = express()




const listenToQueue = async () => {
    while(1){
        try {
            const response = await redisClient.brPop(
            "build-queue" , 0
             );
             console.log(response)
             const id = response?.element
             if(id){
                 await downloadS3Folder(`output/${id}`)
                 await buildProject(id)
                 await distUploadToS3(id)
             }
        } catch (error) {
            console.error(error);
            break;
        }   
    }
}

redisClient
    .connect()
    .then(()=>{
        console.log("Connected To Redis");
        listenToQueue()
    })
    .catch((err)=>{
        console.error("Can't Connect to redis" , err);
        process.exit(1)
    })


// // await buildProject("xpvxq")
// const response = await distUploadToS3("xpvxq")
// console.log(response)

app.listen(8000 , () => {
    console.log(`App started at port 8000`)
})