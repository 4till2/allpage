import aws from 'aws-sdk';

export default async function handler(req, res) {
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
        signatureVersion: 'v4',
    });

    const s3 = new aws.S3();
    const params = {Bucket: process.env.AWS_BUCKET_NAME, Key: req.query.file};
    const url = s3.getSignedUrl('getObject', params)

    res.status(200).json({url:url});
}
