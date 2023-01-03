const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken:
    "8ohrt+UEeunxMGtQD2vtaKp5EvE5g823DeIvO/WP4lKI5sjVkmrxNMYU+uHlQ8xVH9vPDnGFyRhHLGXYMTrghG+731SHT5ziK6Wg+PSCRAzZRjTKo7fXVZzgExXs3+FFNg3gfcw0+ILyr8jJJmZ/vQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "6fa6f48fdc21ec5d0a8a55ddc2b4912a",
};

const app = express();
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);
function handleEvent(event) {
  console.log(event);

  if (event.type === "postback") {
    if (event.postback.data === "burger") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "Thanks for order burger. We will prepare your order shortly",
      });
    }

    if (event.postback.data === "sandwich") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "Thanks for order sandwich. We will prepare your order shortly",
      });
    }
  }

  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (event.message.text.trim().toLowerCase() === "help") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Please type 'menu', 'sandwich' or 'burger'",
    });
  }

  if (event.message.text.trim().toLowerCase() === "burger") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "Thanks for order burger",
    });
  }

  if (event.message.text.trim().toLowerCase() === "sandwich") {
    return client.replyMessage(event.replyToken, {
      type: "image",
      originalContentUrl:
        "https://www.honestfoodtalks.com/wp-content/uploads/2021/08/Inkigayo-sandwich-kpop-idol-snack-recipe.jpeg",
      previewImageUrl:
        "https://www.honestfoodtalks.com/wp-content/uploads/2021/08/Inkigayo-sandwich-kpop-idol-snack-recipe.jpeg",
    });
  }

  if (event.message.text.trim().toLowerCase() === "menu") {
    return client.replyMessage(event.replyToken, {
      type: "template",
      altText: "this is a carousel template",
      template: {
        type: "carousel",
        columns: [
          {
            thumbnailImageUrl:
              "https://www.honestfoodtalks.com/wp-content/uploads/2021/08/Inkigayo-sandwich-kpop-idol-snack-recipe.jpeg",
            imageBackgroundColor: "#FFFFFF",
            title: "Sandwich",
            text: "Yummy sandwich",
            actions: [
              {
                type: "postback",
                label: "Order",
                data: "sandwich",
              },
            ],
          },
          {
            thumbnailImageUrl:
              "https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/master/pass/Smashburger-recipe-120219.jpg",
            imageBackgroundColor: "#000000",
            title: "Burger",
            text: "Best burger",
            actions: [
              {
                type: "postback",
                label: "Order",
                data: "burger",
              },
            ],
          },
        ],
        imageAspectRatio: "rectangle",
        imageSize: "cover",
      },
    });
  }
}

app.listen(4000);
