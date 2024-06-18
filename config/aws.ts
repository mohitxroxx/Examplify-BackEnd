import { S3Client,ListBucketsCommand,ListObjectsV2Command, GetObjectCommand,PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs'
import 'dotenv/config'

const client = new S3Client({
    // endpoint: process.env.R2_ENDPOINT as string,
    region: process.env.R2_BUCKET_REGION as string,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY as string,
        secretAccessKey: process.env.R2_SECRET_KEY as string,
    },
});

// async function test() {
//     const abc=await client.send(
//         new ListBucketsCommand('')
//       )
//       console.log(abc)
// }
// test()
const getUrl=async(key:string)=>{
    const command=new GetObjectCommand({
        Bucket:process.env.R2_BUCKET_NAME as string,
        Key:key
    });
    const url= await getSignedUrl(client,command)
    return url
}

// async function url1() {
//     const value=await url('hi.txt')
//     console.log(value)
// } 
// url1()
const uploadFile=async(file: { name: string, body: Buffer })=>{
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: file.name,
            Body: file.body,
            ContentType:"application/pdf" 
        });
        const response = await client.send(command);
        console.log(response);
    } catch (error) {
        console.error("File upload failed:", error);
    }
}

// uploadFile(process.env.R2_BUCKET_NAME,'hi.txt')
// url1()

export default uploadFile