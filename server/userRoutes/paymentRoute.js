const express = require("express");
const router = express.Router();
const database = require("../database");
const twilio = require("twilio");

router.post("/", async (req, res) => {
  const userOrder = database.generateRandomString();
  for (let i = 0; i < req.body["item-quantity"].length; i++) {
    if (req.body["item-quantity"][i] > 0) {
      await database.addOrder(
        Number(req.body["item-id"][i]),
        Number(req.body["item-quantity"][i]),
        Number(req.session.user_id),
        Number(req.body["restaurant-id"][i]),
        userOrder
      );
    }
  }

  // Twilio - Restuarant
  const accountSid = "ACa9aa2d9bcadd145935bac5e690d4c63a"; // RESTAURANT Account SID from www.twilio.com/console
  const authToken = "085458a61269493e6b8941a2b675ab84"; // RESTAURANT Auth Token from www.twilio.com/console
  const client = new twilio(accountSid, authToken);
  client.messages
    .create({
      body: "A customer has placed an order. Please confirm. Thank you!",
      to: "+16476568050", // Text to Restaurant
      from: "+16474906192" // From Twilio(valid Twilio Number)
    })
    .then(message => (message.sid));

  res.redirect("/userorderstatus");
});

module.exports = router;
