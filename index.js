const fetch = require('node-fetch');
var nodemailer = require('nodemailer');
require('dotenv').config();

let callAPI = async() => {
  let res = "";
  try {

let response = await fetch("https://www.vaccinespotter.org/api/v0/states/NY.json");
let res = []
let date = new Date();
let hour = date.getHours();
let min = date.getMinutes();
console.log(hour, min);
let data = await response.json();
for(let i = 0; i < data.features.length; i++) {
  if(data.features[i].properties['postal_code'] >= 11373 && data.features[i].properties['postal_code'] <= 11375 && data.features[i].properties['appointments_available'] == true && (((min - data.features[i].properties['appointments_last_fetched'].slice(14, 16)) <5 ) || (min + (60 - data.features[i].properties['appointments_last_fetched'].slice(14, 16)) < 5))){
    let appt = [];
    appt.push(data.features[i].properties['address']);
    appt.push(data.features[i].properties['city']);
    appt.push(data.features[i].properties['url']);
    res.push(appt);
  }
}

  if(res.length > 0) {
      await sendEmail(res.join(","));
  } else {
    console.log("No text");
  }
  }catch(err) {
    console.log(err);
  }






function sendEmail(res) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user:process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Pharmacy Alert ',
    text: res
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
}


setInterval(callAPI, 3000);
