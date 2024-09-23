import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export default async function handler(req: any, res: any) {
  console.log("-- sendEmail --");

  if (req.method === "POST") {
    const contactEmail = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await new Promise<void>((resolve, reject) => {
      // verify connection configuration
      contactEmail.verify((error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Ready to Send");
          resolve();
        }
      });
    });

    const { email, message } = await req.body;

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      subject: `Contact Form Submission from (${email})`,
      text: message,
    };

    console.log(mailOptions);

    await new Promise((resolve, reject) => {
      // send mail
      contactEmail.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "success",
      })
    );
  } else {
    // Handle any other HTTP method
    res.statusCode = 404;
    res.end("Not Found");
  }
}
