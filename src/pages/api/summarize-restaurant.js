import { exec } from "child_process";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body;

    try {
      // Call Python script with the URL as an argument
      exec(
        `python3 src/utils/python-summarize-restaurant.py ${url}`,
        (error, stdout) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return res
              .status(500)
              .json({ error: "Failed to summarize the restaurant." });
          }
          res.status(200).json({ summary: stdout });
        }
      );
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// import axios from "axios";
// import * as cheerio from "cheerio";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { url } = req.body;
//     const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

//     console.log("url: ", url);

//     try {
//       // Fetch webpage content
//       const axiosResponse = await axios.request({
//         method: "GET",
//         url: url,
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
//         },
//       });

//       if (!axiosResponse || !axiosResponse.data) {
//         throw new Error("Failed to fetch the webpage content.");
//       }

//       // Use Cheerio to extract text from the HTML
//       const $ = cheerio.load(axiosResponse.data);
//       const textContent = $("body")?.text()?.replace(/\s+/g, " ").trim();

//       if (!textContent || textContent.length === 0) {
//         throw new Error("Failed to extract content from the page.");
//       }

//       // Send the summary to GPT API for summarization
//       const apiUrl = "https://api.openai.com/v1/chat/completions";
//       const headers = {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       };
//       const data = {
//         model: "gpt-3.5-turbo-0125",
//         messages: [
//           {
//             role: "user",
//             content: `Summarize menu: ${textContent}`,
//           },
//         ],
//       };

//       const gptResponse = await axios.post(apiUrl, data, { headers });
//       const summary = gptResponse.data.choices[0].message.content;

//       res.status(200).json({ summary });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Failed to summarize the restaurant." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
