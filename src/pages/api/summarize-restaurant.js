import { exec } from "child_process";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body; // Expecting the restaurant URL to summarize

    try {
      // Call Python script with the URL as an argument
      exec(
        `python3 src/utils/python-summarize-restaurant.py ${url}`,
        (error, stdout, stderr) => {
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
