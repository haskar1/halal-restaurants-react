import { generateUploadUrl } from "@/utils/s3";
import axios from "axios";
import sharp from "sharp";

export default async function s3Url(req, res) {
  const { photoUri, imageName } = JSON.parse(req.body);

  if (!photoUri || !imageName) {
    return res
      .status(400)
      .json({ message: "photoUri and imageName are required" });
  }

  // Sanitize the image name
  const escapedImageName = imageName
    .replaceAll(" ", "-")
    .replaceAll("'", "")
    .replaceAll("&", "and");

  try {
    // Fetch the image using axios
    const response = await axios({
      url: photoUri,
      method: "GET",
      responseType: "arraybuffer", // Fetch the image as a buffer
    });

    // Convert the image to JPEG and compress it using sharp
    const compressedImageBuffer = await sharp(response.data)
      .jpeg({ mozjpeg: true }) // Compress the image
      .toBuffer();

    // Fetch the Amazon S3 bucket upload url
    const data = await generateUploadUrl(escapedImageName);
    const uploadUrl = data.uploadUrl;
    const publicUrl = data.publicUrl;

    // Upload image to S3 bucket
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: compressedImageBuffer,
    });
    res.status(200).json({
      publicUrl: publicUrl,
      message: `Successfully uploaded image to: ${publicUrl}`,
    });
  } catch (error) {
    console.error("Error during S3 upload:", error);
    res.status(500).json({ message: `Image upload failed: ${error}` });
  }
}
