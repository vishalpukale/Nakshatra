const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.AWS_REGION || '';
let s3
if (region) {
    s3 = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error('AWS_S3_BUCKET environment variable is not set');
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
        // No ACL if bucket owner enforced
    });
    await s3.send(command);
    // Construct the S3 URL manually
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
    return { url, key: fileName, bucket };
};

const extractS3KeyFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.slice(1); // removes the leading "/"
    } catch (e) {
      return null;
    }
  };

const getS3SignedUrl = async (key, expiresInSeconds = 300) => {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error('AWS_S3_BUCKET environment variable is not set');
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
};

module.exports = { uploadFileToS3, getS3SignedUrl,extractS3KeyFromUrl }; 