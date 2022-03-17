const express = require("express");
const nodemailer = require("nodemailer");
const app = express.Router();
require("dotenv").config()

app.post('/', (req, res) => {
    
    let {name, email ,textarea} = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
         }
      });
      
      const mailOptions = {
        from: email,
        to: 'emihleemza510@gmail.com',
        subject: 'you contacted us',
        text: `${name} has sent you an email! 
        
        ${textarea}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send({msg: "Email not sent!"});
        } else {
          console.log('Email sent: ' + info.response);
          res.send({msg: "Email has been sent successfully."});
        }
      });
})

module.exports = app