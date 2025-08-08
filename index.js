const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nagaraja.nagas.2003@gmail.com",
    pass: "hwsx keex wbry qcan", // App password
  },
  tls: {
    rejectUnauthorized: false,
  },
});




// ✅ CORS Setup for Vercel
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://loin-logic-nags-9wbb.vercel.app'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
// -------------------- CAREER ROUTE --------------------
app.post("/send-career", upload.single("resume"), (req, res) => {
  const { name, email, phone } = req.body;
  const resume = req.file;

  if (!name || !email || !phone || !resume) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const mailOptions = {
    from: email,
    to: "nn1528523@gmail.com",
    subject: "New Career Application",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
    attachments: [
      {
        filename: resume.originalname,
        content: resume.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Career email error:", error);
      return res.status(500).json({ message: "Failed to send application", error: error.message });
    } else {
      console.log("Career email sent: " + info.response);
      return res.status(200).json({ message: "Application submitted successfully", info: info.response });
    }
  });
});

// -------------------- CONTACT ROUTE --------------------
app.post("/send-email", (req, res) => {
  const { fullname, email, phone, description, subject } = req.body;

  if (!fullname || !email || !phone || !description || !subject) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const mailOptions = {
    from: email,
    to: "nn1528523@gmail.com", // your receiving email
    subject: `New Contact Form: ${subject}`,
    text: `
      Name: ${fullname}
      Email: ${email}
      Phone: ${phone}
      Subject: ${subject}

      Message:
      ${description}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Contact form error:", error);
      return res.status(500).json({ message: "Failed to send message", error: error.message });
    } else {
      console.log("Contact email sent: " + info.response);
      return res.status(200).json({ message: "Message sent successfully", info: info.response });
    }
  });
});





// -------------------- FEEDBACK ROUTE --------------------
app.post("/send-feedback", (req, res) => {
  const { name, email, phone, address, feedback } = req.body;

  if (!name || !email || !phone || !address || !feedback) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const mailOptions = {
    from: email,
    to: "nn1528523@gmail.com",
    subject: "New Feedback Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}
      Feedback: ${feedback}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Feedback form error:", error);
      return res.status(500).json({ message: "Failed to send feedback", error: error.message });
    } else {
      console.log("Feedback email sent: " + info.response);
      return res.status(200).json({ message: "Feedback sent successfully", info: info.response });
    }
  });
});

// -------------------- STATIC FILE SERVING --------------------
app.use(express.static(path.join(__dirname, "/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
