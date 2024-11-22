const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");


const transporterDetails = smtpTransport({
    host: "mail.react-cafe.ir",
    port: 465,
    secure: true,
    auth: {
        user: "no-reply@react-cafe.ir",
        pass: "reactcafe123456",
    },
    tls: {
        rejectUnauthorized: false,
    },
});


// const transporter = nodeMailer.createTransport(transporterDetails);


// const options = {
//     from: "no-reply@react-cafe.ir",
//     to: "amirshammas@gmail.com",
//     subject: "test send email",
//     text: "hello amir !",
// };


// transporter.sendMail(options, (err, info) => {
//     if (err) return console.log(err);
//     console.log(info);
// });


// exports.sendEmail = (email, username, subject, message) => {
//     const transporter = nodeMailer.createTransport(transporterDetails);
//     transporter.sendMail({
//         from: "no-reply@react-cafe.ir",
//         to: email,
//         subject: subject,
//         html: `<h1> سلام ${username}</h1>
//             <h2>${message}</h2>`,
//     });
// };


exports.sendEmail = (email, username, subject, message) => {

    const transporter = nodeMailer.createTransport(transporterDetails);

    const options = {
        from: "no-reply@react-cafe.ir",
        to: email,
        subject: subject,
        html: ` <h1> سلام ${username}</h1>
                <h2>${message}</h2>
              `,
    }

    transporter.sendMail(options, (err, info) => {
        if (err) return console.log({message:"No mail sent !"});
        console.log({message:"Mail sent successfully !", info: info});
    });
};
