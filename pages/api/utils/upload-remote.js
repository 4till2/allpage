import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


export default async function handler(req, res) {
    const key = uuidv4()
    aws.config.update({
        accessKeyId: process.env.ALLPAGE_AWS_ACCESS_KEY,
        secretAccessKey: process.env.ALLPAGE_AWS_SECRET_KEY,
        region: process.env.ALLPAGE_AWS_REGION,
        signatureVersion: 'v4',
    });
    const s3 = new aws.S3();
    const post = await s3.createPresignedPost({
        Bucket: process.env.ALLPAGE_AWS_BUCKET_NAME,
        Fields: {
            key: key,
        },
        Expires: 60, // seconds
        Conditions: [
            ['content-length-range', 0, 1048576], // up to 1 MB
        ],
    });
    res.status(200).json(post);
}
