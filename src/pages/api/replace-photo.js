// import { exec } from "child_process";
// import sharp from "sharp";
// import axios from "axios";

// export default async function handler(req, res) {
//   const { photoUri, imageName } = JSON.parse(req.body);

//   if (!photoUri || !imageName) {
//     return res
//       .status(400)
//       .json({ message: "photoUri and imageName are required" });
//   }

//   const escapedImageName = imageName
//     .replaceAll(" ", "-")
//     .replaceAll("'", "")
//     .replaceAll("&", "and");

//   try {
//     // Fetch the image using axios
//     const response = await axios({
//       url: photoUri,
//       method: "GET",
//       responseType: "arraybuffer", // Fetch the image as a buffer
//     });

//     // Convert the image to JPEG and compress it using sharp
//     const compressedImageBuffer = await sharp(response.data)
//       .jpeg({ mozjpeg: true }) // Mozjpeg reduces file size
//       .toBuffer();

//     // First, delete the existing image from the R2 bucket
//     exec(
//       `npx wrangler r2 object delete images/${escapedImageName}`,
//       (deleteError, deleteStdout) => {
//         if (deleteError) {
//           console.error("Error deleting existing image from R2:", deleteError);
//           return res
//             .status(500)
//             .json({ message: "Error deleting existing image" });
//         }

//         console.log("Delete from R2 successful:", deleteStdout);

//         // Then, upload the new image to the same imageName, so the img.whoishalal.com url doesn't change
//         // Use the local path to wrangler within node_modules
//         const wranglerPath = path.resolve(
//           process.cwd(),
//           "node_modules/.bin/wrangler"
//         );

//         // Use execFile to execute wrangler directly and upload image to R2
//         const wranglerProcess = execFile(
//           wranglerPath,
//           [
//             "r2",
//             "object",
//             "put",
//             `images/${escapedImageName}`,
//             "--content-type",
//             "image/jpeg",
//             "--pipe",
//           ],
//           (error, stdout, stderr) => {
//             if (error) {
//               console.error(`Wrangler error: ${error}`);
//               return res
//                 .status(500)
//                 .json({ message: `Error uploading to R2: ${stderr}` });
//             }
//             console.log(`Upload to R2 successful: ${stdout}`);
//             res.status(200).json({ message: "Upload successful" });
//           }
//         );

//         // Write the compressed image buffer to Wrangler's stdin
//         wranglerProcess.stdin.write(compressedImageBuffer);
//         wranglerProcess.stdin.end(); // Close the stream
//       }
//     );
//   } catch (error) {
//     console.error("Error during the replace process:", error);
//     return res.status(500).json({ message: "Error replacing image" });
//   }
// }
