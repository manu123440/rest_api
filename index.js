const express = require('express');

const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config(); 

const session = require("express-session");

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const checkout1Route = require('./routes/getCheckout1');
const checkout2Route = require('./routes/getCheckout2');
const checkoutRoute = require('./routes/postCheckout');
const paymentRoute = require('./routes/payment');
const homeRoute = require('./routes/getHome');
const videoRoute = require('./routes/getVideo');
const searchVideoRoute = require('./routes/searchVideo');
const checkSubscriptionRoute = require('./routes/checkSubscription');
const resumeSubscriptionRoute = require('./routes/resumeSubscription');
const cancelSubscriptionRoute = require('./routes/cancelSubscription');
const successRoute = require('./routes/success');
const cancelRoute = require('./routes/cancel');
const listSubscriptionRoute = require('./routes/listSubscription');
const getSessionRoute = require('./routes/getSession');
const episodesRoute = require('./routes/getEpisodes');

const app = express();

const PORT = 3000;

app.set("trust proxy", 1);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/v1', loginRoute);
app.use('/v1', registerRoute);
app.use('/v1', checkout1Route);
app.use('/v1', checkout2Route);
app.use('/v1', checkoutRoute);
app.use('/v1', homeRoute);
app.use('/v1', videoRoute);
app.use('/v1', searchVideoRoute);
app.use('/v1', checkSubscriptionRoute);
app.use('/v1', resumeSubscriptionRoute);
app.use('/v1', cancelSubscriptionRoute);
app.use('/v1', successRoute);
app.use('/v1', cancelRoute);
app.use('/v1', paymentRoute);
app.use('/v1', listSubscriptionRoute);
app.use('/v1', getSessionRoute);
app.use('/v1', episodesRoute);

app.listen(
	PORT, 
	() => {
		console.log("Listening to localhost PORT " + PORT);
	}
)
