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


// app.post("/submit-experience-form", upload.none(), (req, res) => {
//   console.log("🚀 ~ app.post ~ req:", req.body)
//   const name = req.body["Name-5"];
//   const email = req.body["email-5"];
//   const phone = req.body["Phone-2"];
//   const subject = req.body["Subject"];
//   const message = req.body["Field-6"];

//   const mailOptions = {
//     from: `${email}`, // Sender address
//     to: "office@clearskyservices.co", // Recipient address (your email)
//     subject: `New Contact Form Submission: ${subject}`,
//     text: `
//             Name: ${name}
//             Email: ${email}
//             Phone: ${phone}
//             Subject: ${subject}
//             Message: ${message}
//         `,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ success: false, message: "Something went wrong." });
//     } else {
//       res.status(200).json({
//         success: true,
//         message: "Thank you! Your submission has been received!",
//       });
//     }
//   });
// });
app.post("/submit-experience-form", upload.none(), (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req.body);
  
  // Extract all form data from the request body
  const formData = req.body;

  // Create the email content with all form fields
  const emailContent = `
    <h2>New Experience Questionnaire Submission</h2>
    
    <h3>Company Information</h3>
    <p><strong>Email:</strong> ${formData.Email || 'Not provided'}</p>
    <p><strong>Company Name:</strong> ${formData['Company-Name'] || 'Not provided'}</p>
    <p><strong>Company Address:</strong> ${formData['Company-Address'] || 'Not provided'}</p>
    <p><strong>Company Phone:</strong> ${formData['Company-Phone'] || 'Not provided'}</p>
    <p><strong>Business Type:</strong> ${formData['Business-Type'] || 'Not provided'}</p>
    
    <h3>Experience Information</h3>
    <p><strong>Years in Work:</strong> ${formData['Years-In-Work'] || 'Not provided'}</p>
    <p><strong>Years as Prime Contractor:</strong> ${formData['Years-Prime-Contractor'] || 'Not provided'}</p>
    <p><strong>Years as Sub-Contractor:</strong> ${formData['Years-Sub-Contractor'] || 'Not provided'}</p>
    <p><strong>Bond Ability:</strong> ${formData['Bond-Ability'] || 'Not provided'}</p>
    <p><strong>Ever Failed to Complete Work:</strong> ${formData['Failed-Work'] || 'Not provided'}</p>
    <p><strong>Work Completed by Performance Bond:</strong> ${formData['Completed-By-Bond'] || 'Not provided'}</p>
    <p><strong>Failure Reasons:</strong> ${formData['Failure-Reasons'] || 'Not provided'}</p>
    <p><strong>Minimum Employees:</strong> ${formData['Min-Employees'] || 'Not provided'}</p>
    <p><strong>Maximum Employees:</strong> ${formData['Max-Employees'] || 'Not provided'}</p>
    <p><strong>Regular Employees:</strong> ${formData['Regular-Employees'] || 'Not provided'}</p>
    <p><strong>Equipment:</strong> ${formData.Equipment || 'Not provided'}</p>
    
    <h3>Principal Individuals</h3>
    <h4>Person 1</h4>
    <p><strong>Name:</strong> ${formData['Person1-Name'] || 'Not provided'}</p>
    <p><strong>City:</strong> ${formData['Person1-City'] || 'Not provided'}</p>
    <p><strong>Position:</strong> ${formData['Person1-Position'] || 'Not provided'}</p>
    <p><strong>Years of Experience:</strong> ${formData['Person1-Experience'] || 'Not provided'}</p>
    <p><strong>Work Type:</strong> ${formData['Person1-Work'] || 'Not provided'}</p>
    
    <h4>Person 2</h4>
    <p><strong>Name:</strong> ${formData['Person2-Name'] || 'Not provided'}</p>
    <p><strong>City:</strong> ${formData['Person2-City'] || 'Not provided'}</p>
    <p><strong>Position:</strong> ${formData['Person2-Position'] || 'Not provided'}</p>
    <p><strong>Years of Experience:</strong> ${formData['Person2-Experience'] || 'Not provided'}</p>
    <p><strong>Work Type:</strong> ${formData['Person2-Work'] || 'Not provided'}</p>
    
    <h4>Person 3</h4>
    <p><strong>Name:</strong> ${formData['Person3-Name'] || 'Not provided'}</p>
    <p><strong>City:</strong> ${formData['Person3-City'] || 'Not provided'}</p>
    <p><strong>Position:</strong> ${formData['Person3-Position'] || 'Not provided'}</p>
    <p><strong>Years of Experience:</strong> ${formData['Person3-Experience'] || 'Not provided'}</p>
    <p><strong>Work Type:</strong> ${formData['Person3-Work'] || 'Not provided'}</p>
    
    <h4>Person 4</h4>
    <p><strong>Name:</strong> ${formData['Person4-Name'] || 'Not provided'}</p>
    <p><strong>City:</strong> ${formData['Person4-City'] || 'Not provided'}</p>
    <p><strong>Position:</strong> ${formData['Person4-Position'] || 'Not provided'}</p>
    <p><strong>Years of Experience:</strong> ${formData['Person4-Experience'] || 'Not provided'}</p>
    <p><strong>Work Type:</strong> ${formData['Person4-Work'] || 'Not provided'}</p>
    
    <h3>Project References</h3>
    <h4>Project 1</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project1-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project1-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project1-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project1-Contact'] || 'Not provided'}</p>
    
    <h4>Project 2</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project2-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project2-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project2-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project2-Contact'] || 'Not provided'}</p>
    
    <h4>Project 3</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project3-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project3-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project3-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project3-Contact'] || 'Not provided'}</p>
    
    <h4>Project 4</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project4-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project4-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project4-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project4-Contact'] || 'Not provided'}</p>
    
    <h4>Project 5</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project5-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project5-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project5-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project5-Contact'] || 'Not provided'}</p>
    
    <h4>Project 6</h4>
    <p><strong>Contract Amount:</strong> ${formData['Project6-Amount'] || 'Not provided'}</p>
    <p><strong>Type of Project:</strong> ${formData['Project6-Type'] || 'Not provided'}</p>
    <p><strong>Status:</strong> ${formData['Project6-Status'] || 'Not provided'}</p>
    <p><strong>Contact Info:</strong> ${formData['Project6-Contact'] || 'Not provided'}</p>
  `;

  const mailOptions = {
    from: `${formData.Email}`, // Sender address
    to: "office@clearskyservices.co", // Recipient address
    subject: `New Experience Questionnaire Submission from ${formData['Company-Name'] || 'Unknown Company'}`,
    html: emailContent, // Use HTML format for better formatting
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ 
        success: false, 
        message: "Something went wrong while submitting the form." 
      });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({
        success: true,
        message: "Thank you! Your experience questionnaire has been submitted successfully.",
      });
    }
  });
});

app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
