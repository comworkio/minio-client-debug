import * as Minio from 'minio';
import * as crypto from 'crypto';
import { writeFile, createReadStream } from 'fs';
import { setTimeout } from 'timers/promises';

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
    writeFile(filename, line, { encoding: "utf8", flag: "w" }, function (){})
    var hash = crypto.createHash('md5');
    hash.setEncoding('base64');
    var fileStream = createReadStream(filename);
    fileStream.on('end', () => {
        hash.end();
        minioClient.fPutObject(process.env.BUCKET_NAME, filename, "dir/" + filename, { 
                'Content-Type': 'application/octet-stream', 
                'Content-MD5': hash.read() 
            }, 
            function(err, etag) {
                if (err) {
                    return console.log(err)
                }
            }
        );
    })

    console.log(line)
    await setTimeout(wait_time * 1000);
}
