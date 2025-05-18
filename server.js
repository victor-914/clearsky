const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const multer = require("multer");
const axios = require("axios");

// CLOUDINARY_KEY=177123464136985
// CLOUDINARY_NAME=dxixcpnl4
// CLOUDINARY_SECRET=D96Yw6aWtHqMRt80KxZwlz1TLJ8

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dxixcpnl4",
  api_key: "177123464136985",
  api_secret: "D96Yw6aWtHqMRt80KxZwlz1TLJ8",
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: "office@clearskyservices.co",
    pass: "ynnrkhfkxrlwljja",
  },
});

// Helper function to upload stream to Cloudinary
const uploadStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error, 30000);
        else resolve(result);
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null); // Signals end of stream
    bufferStream.pipe(cloudinaryUploadStream);
  });
};

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



app.post(
  "/submit-partner-registration",
  upload.array("Documents"),
  async (req, res) => {
    try {
      // Handle file uploads to Cloudinary

      const formData = req.body;
      const files = req.files;


       if(!files || !formData || files.length === 0){
        return "No file"
       }
      // console.log("🚀 ~ files:", files);
      const cloudinaryUrls = [];
      for (const file of files) {
        try {
          const result = await uploadStream(file.buffer, {
            resource_type: "raw",
            folder: "partner_documents",
            filename_override: file.originalname,
            use_filename: true,
            unique_filename: false,
            access_mode: "public",
            flags: 'attachment',
            timeout: 20000
          });

          cloudinaryUrls.push({
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
          })
          console.log(cloudinaryUrls,",,,,,,,,,,,,,")
        } catch (uploadError) {
          continue; // Skip to next file
        }
      }

      let emailContent =
        '<h1>New Partner registration</h1><table border="1" cellpadding="5">';

      // Loop through all fields and add to email content
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          // Only include fields with values
          emailContent += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
        }
      }

      emailContent += "</table>";
      emailContent += `<h2>Uploaded Documents</h2><br/>
      <ul>
        ${cloudinaryUrls.map((url) => `<li>${url.url}</li>`)}
      </ul>`;

      const mailOptions = {
        from: `${formData["Contact-Email"] || "no-reply@clearskyservices.co"}`,
        to: "office@clearskyservices.co",
        subject: `New Partner Registration from ${
          formData["Legal-Company-Name"] || "Unknown Company"
        }`,
        html: emailContent,
      };

      // Send email
      if(cloudinaryUrls.length !== 0){
        transporter.sendMail(mailOptions, (error, info) => {
          // console.log("🚀 ~ transporter.sendMail ~ info:", info)
          if (error) {
            console.log("🚀 ~ transporter.sendMail ~ error:", error)
            console.error("Error sending email:", error);
            res.status(500).json({
              success: false,
              message: "Something went wrong while submitting the form.",
            });
          } else {
            res.status(200).json({
              success: true,
              message:
                "Thank you! Your partner registration has been submitted successfully.",
            });
          }
        });
      }
    } catch (error) {
      console.error("Error processing form:", error);
      res.status(500).json({
        success: false,
        message: "Error processing file uploads. Please try again.",
      });
    }
  }
);


app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
