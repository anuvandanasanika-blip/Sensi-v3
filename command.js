const axios = require("axios");
require("dotenv").config();

const token = process.env.PAGE_ACCESS_TOKEN;
const phoneId = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

function handleCommand(from, msg) {
  if (msg === "hi") {
    sendMessage(from, "Hello 👋, I'm your bot!");
  } else if (msg === "owner") {
    sendMessage(from, "This bot owner is: " + process.env.OWNER_NUMBER);
  } else {
    sendMessage(from, "I don't understand that 😅");
  }
}

module.exports = { handleCommand };
