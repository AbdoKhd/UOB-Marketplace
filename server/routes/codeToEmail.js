const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const crypto = require("crypto");
const ResetCode = require("../models/ResetCode"); // Create this model
require("dotenv").config();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Reset Code API
router.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;

  console.log("sending code to this email: ", email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 4-digit reset code
    const resetCode = crypto.randomInt(1000, 9999).toString();

    // Store the reset code in the database with expiration
    await ResetCode.findOneAndUpdate(
      { email },
      { email, code: resetCode, expiresAt: Date.now() + 5 * 60 * 1000 }, // Expires in 1 minutes
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: `"UOB Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}. It expires in 5 minutes`,
      // replyTo: "UOB@marketplace.com",
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({ message: "Reset code sent successfully" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ message: "Error sending reset code" });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const resetCodeEntry = await ResetCode.findOne({ email, code });

    if (!resetCodeEntry) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    if (resetCodeEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying reset code" });
  }
});


module.exports = router;
