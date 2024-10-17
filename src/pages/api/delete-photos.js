// import { exec } from "child_process";

// export default async function handler(req, res) {
//   const { slug } = JSON.parse(req.body);

//   if (!slug) {
//     return res.status(400).json({ message: "Slug is required" });
//   }

//   const escapedSlug = slug
//     .replaceAll(" ", "-")
//     .replaceAll("'", "")
//     .replaceAll("&", "and");

//   try {
//     // Delete photo 1 from Cloudflare R2 bucket
//     exec(
//       `npx wrangler r2 object delete images/${escapedSlug}-photo-1`,
//       (deleteError, deleteStdout) => {
//         if (deleteError) {
//           console.error(
//             "Error deleting photo 1 from images bucket:",
//             deleteError
//           );
//         } else {
//           console.log(
//             "Delete photo 1 from images bucket successful:",
//             deleteStdout
//           );
//         }

//         // Delete photo 2 from Cloudflare R2 bucket
//         exec(
//           `npx wrangler r2 object delete images/${slug}-photo-2`,
//           (deleteError, deleteStdout) => {
//             if (deleteError) {
//               console.error(
//                 "Error deleting photo 2 from images bucket:",
//                 deleteError
//               );
//             } else {
//               console.log(
//                 "Delete photo 2 from images bucket successful:",
//                 deleteStdout
//               );
//             }

//             // Delete photo 3 from Cloudflare R2 bucket
//             exec(
//               `npx wrangler r2 object delete images/${slug}-photo-3`,
//               (deleteError, deleteStdout) => {
//                 if (deleteError) {
//                   console.error(
//                     "Error deleting photo 3 from images bucket:",
//                     deleteError
//                   );
//                 } else {
//                   console.log(
//                     "Delete photo 3 from images bucket successful:",
//                     deleteStdout
//                   );
//                 }
//                 return res.status(200).json({
//                   message:
//                     "Deleted image(s). Please check Cloudflare to verify deletion.",
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error during the deleting process:", error);
//     return res
//       .status(500)
//       .json({ message: "Error deleting one or more images" });
//   }
// }
