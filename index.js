import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { fullname, email, phone, subject, description } = req.body;
  if (!fullname || !email || !phone || !subject || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "nn1528523@gmail.com",
      subject: `New Contact Form: ${subject}`,
      text: `
        Name: ${fullname}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}

        Message:
        ${description}
      `,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
}
