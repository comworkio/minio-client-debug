import Minio from 'minio';
import { writeFile } from 'fs';
import { setTimeout } from 'timers/promises';

var filename = process.env.BUCKET_FILENAME
var wait_time = process.env.WAIT_TIME

var minioClient = new Minio.Client({
    endPoint: process.env.BUCKET_ENDPOINT,
    port: 443,
    useSSL: true,
    accessKey: process.env.BUCKET_ACCESS_KEY,
    secretKey: process.env.BUCKET_SECRET_KEY
});

while(true) {
    var line = "Written at " + new Date().toISOString()
    writeFile(filename, line, { encoding: "utf8", flag: "w" }, function (){})

    var metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }

    minioClient.fPutObject(process.env.BUCKET_NAME, process.env.BUCKET_REGION, filename, metaData, function(err, etag) {
        if (err) {
            return console.log(err)
        }
    });

    console.log(line)
    await setTimeout(wait_time * 1000);
}
