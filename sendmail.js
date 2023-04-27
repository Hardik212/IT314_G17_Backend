const nodemailer = require("nodemailer");


const sendmailUtils = async (email, subject, text) => {

    let transporter = nodemailer.createTransport({
        host: "smpt.daiict.ac.in",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail
    let info = await transporter.sendMail({
        from: '"Harsh Prajapati" <harshmp492@outlook.com>"', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    

};

// sendmailUtils(""

module.exports={sendmailUtils};

