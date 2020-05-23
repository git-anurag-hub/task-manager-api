const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name)=>{
    sgMail.send({
        to : email,
        from:"aguptaking@gmail.com",
        subject: "Welcome to Task Manager App",
        text : `Thanks for joining ${name}. Let me know how you get to know about this!!`
    })
}

const sendCancelEmail = (email , name)=>{
    sgMail.send({
        to : email,
        from:"aguptaking@gmail.com",
        subject: "Sorry to see you go!",
        text : `GoodBye ${name}. Is their anything we can do for you to keep you onboard!!`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}