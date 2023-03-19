const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const nodemailer = require("nodemailer");

router.post('/webhooks', express.raw({type: 'application/json'}), async (req, res, next) => {
    const endpointSecret = process.env.ENDPOINT_SECRET;

    const sig = req.headers['stripe-signature'];
    const payload = req.body;

    let event;
    let session = '';

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // console.log(event.type);
    // console.log(event.data.object);
    // console.log(event.data.object.id);

    switch (event.type) {
        case 'checkout.session.async_payment_failed':
            session = event.data.object;
            // console.log('failed', session);
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        case 'checkout.session.async_payment_succeeded':
            session = event.data.object;
            // console.log('succeed', session);
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        case 'checkout.session.completed':
            session = event.data.object;
            const emailTo = session.customer_details.email;
            // send invoice email using nodemailer
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Thanks for the Payment for the Product", // Subject line
                text: "Thanks for the Payment for the Product", // plain text body
                html: `
                    Hello ${session.customer_details.email} Thanks for the Payment for the Product
                `, // html body
            });
            // console.log('completed', session, info);

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case 'checkout.session.expired':
            session = event.data.object;
            // console.log('expired', session);
            // Then define and call a function to handle the event checkout.session.expired
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ success: true });
});

module.exports = router;