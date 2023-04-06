const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    host: "api.tourmeet.ir",
    port: 465,
    secure: true,
    auth: {
        user: "support@tourmeet.ir",
        pass: "Salar@9757110043",
    },
    tls: {
        rejectUnauthorized: false,
    },
    
});

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from: "support@tourmeet.ir",
        to: email,
        subject: subject,
        html: `<h1> سلام ${fullname}</h1>
            <p>${message}</p>`,
    }).then((res)=>{
console.log(res)
    })
};
