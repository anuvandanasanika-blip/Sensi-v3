import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const token = process.env.WHATSAPP_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// ✅ Verify webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (mode && verify_token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Receive messages
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (messages && messages[0]) {
    const from = messages[0].from;
    const msgBody = messages[0].text?.body;

    console.log("📩 Received:", msgBody);

    // Reply back
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: `AI Bot Reply: ${msgBody}` },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Bot running on port", PORT));
