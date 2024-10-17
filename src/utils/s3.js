import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";

// Using AWS s3 bucket Details
const region = process.env.AWS_S3_REGION;
const Bucket = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_KEY;

// This initializes the s3 bucket
const s3 = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// AWS URL
export async function generateUploadUrl(imageName) {
  const publicUrl = `https://whoishalal-images.s3.us-east-2.amazonaws.com/${imageName}.jpeg`;

  const params = {
    Bucket: Bucket,
    Key: `${imageName}.jpeg`,
    ContentType: "image/jpeg",
  };
  console.log("S3 Params:", params);

  try {
    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params));
    return {
      uploadUrl: uploadUrl,
      publicUrl: publicUrl,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}
