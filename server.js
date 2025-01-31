const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const upload = multer();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: "okaforchineduvictornako@gmail.com",
    pass: "bdpmjiexysqlzudi",
  },
});

app.post("/submit-form", upload.none(), (req, res) => {
  const name = req.body["Name-5"];
  const email = req.body["email-5"];
  const phone = req.body["Phone-2"];
  const subject = req.body["Subject"];
  const message = req.body["Field-6"];

  const mailOptions = {
    from: `${email}`, // Sender address
    to: "office@clearskyservices.co", // Recipient address (your email)
    subject: `New Contact Form Submission: ${subject}`,
    text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Subject: ${subject}
            Message: ${message}
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res
        .status(500)
        .json({ success: false, message: "Something went wrong." });
    } else {
      res.status(200).json({
        success: true,
        message: "Thank you! Your submission has been received!",
      });
    }
  });
});

app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
