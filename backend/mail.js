import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"

dotenv.config()

export async function sendEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: "erikthompson@yandex.com", // Change to your recipient
    from: "noreply@wholesoft.net", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent")
    })
    .catch((error) => {
      console.error(error)
    })
}

//sendEmail()
