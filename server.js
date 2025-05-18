require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors")




// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CN,
  api_key: process.env.CAK,
  api_secret: process.env.CAS,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:3000', 'https://clearskyservices.co'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.GM_USER,
    pass: process.env.GM_PASS,
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
      // console.log("🚀 ~ formData:", formData)
      const files = req.files;
      console.log("🚀 ~ files:", files);

      if (!files || !formData || files.length === 0) {
        return "No file";
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
            flags: "attachment",
            timeout: 20000,
          });

          cloudinaryUrls.push({
            originalName: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
          });
          console.log(cloudinaryUrls, ",,,,,,,,,,,,,");
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
      if (cloudinaryUrls.length !== 0) {
        transporter.sendMail(mailOptions, (error, info) => {
          console.log("🚀 ~ transporter.sendMail ~ info:", info);
          if (error) {
            console.log("🚀 ~ transporter.sendMail ~ error:", error);
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

app.post("/site_visit", async (req, res) => {
  try {
    // Handle file uploads to Cloudinary

    const formData = req.body;
    // console.log("🚀 ~ formData:", formData);

    // Generate HTML email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Visit Availability Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 5px 5px;
        }
        .detail-row {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-label {
            font-weight: bold;
            color: #555555;
            display: inline-block;
            width: 120px;
        }
        .status-available {
            color: #4CAF50;
            font-weight: bold;
        }
        .status-unavailable {
            color: #e74c3c;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Site Visit Availability Notification</h1>
    </div>
    
    <div class="content">
        <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span>${new Date(formData.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Company:</span>
            <span>${formData.company || "Not provided"}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span>${formData.email || "Not provided"}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Availability:</span>
            <span class="${
              formData.available === "yes"
                ? "status-available"
                : "status-unavailable"
            }">
                ${formData.available === "yes" ? "Available" : "Not Available"}
            </span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Notes:</span>
            <span>${formData.notes || "No additional notes provided"}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Submitted:</span>
            <span>${new Date(formData.submittedAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })}</span>
        </div>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ClearSky Services. All rights reserved.</p>
    </div>
</body>
</html>
`;

    const mailOptions = {
      from: `${formData.email || "no-reply@clearskyservices.co"}`,
      to: "office@clearskyservices.co",
      subject: `Site Visit Availability for ${
        formData.company || "Unknown Company"
      } on ${formData.date}`,
      html: emailContent,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      // console.log("🚀 ~ transporter.sendMail ~ info:", info);
      if (error) {
        console.log("🚀 ~ transporter.sendMail ~ error:", error);
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
  } catch (error) {
    console.error("Error processing form:", error);
    res.status(500).json({
      success: false,
      message: "Error processing file uploads. Please try again.",
    });
  }
});

app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
