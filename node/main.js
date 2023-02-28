import * as Minio from 'minio';
import { writeFile } from 'fs';
import { setTimeout } from 'timers/promises';

var dirpath = process.env.BUCKET_DIRPATH
var filename = process.env.BUCKET_FILENAME
var wait_time = process.env.WAIT_TIME

var minioClient = new Minio.Client({
    endPoint: process.env.BUCKET_ENDPOINT,
    accessKey: process.env.BUCKET_ACCESS_KEY,
    secretKey: process.env.BUCKET_SECRET_KEY,
    region: process.env.BUCKET_REGION
});

while(true) {
    var line = "Written at " + new Date().toISOString()
    writeFile(filename, line, { encoding: "utf8", flag: "w" }, (err) => {
        if (err) {
            console.log("Unexpected error: " + err)
            return;
        }

        minioClient.fPutObject(process.env.BUCKET_NAME, dirpath + "/" + filename, filename);
        console.log(line)
    })

    await setTimeout(wait_time * 1000);
}
