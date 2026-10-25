const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const qs = require("qs");

async function sendSms(number, message) {
  try {
    // Load API details from environment variables
    const apiKey = process.env.SMS_API_KEY;
    const sender = process.env.SMS_SENDER;

    if (!apiKey) throw new Error("SMS API Key is missing!");
    if (!number || !/^[6-9]\d{9}$/.test(number)) throw new Error("Invalid mobile number.");
    if (!message || message.trim() === "") throw new Error("Message cannot be empty.");

    // Prepare the payload
    const data = qs.stringify({
      apikey: apiKey,
      message: message,
      sender: sender,
      numbers: "91" + number,
    });

    // Send SMS request
    const response = await axios.post("https://api.textlocal.in/send/", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Return API response
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSms };
