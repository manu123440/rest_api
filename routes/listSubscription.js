const express = require('express');

const request = require('request-promise-any');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

router.post('/listSubscription',async (req, res, next) => {
	let isActive = false;
	try {
		const subscription = await stripe.subscriptions.list({})
		console.log(subscription.data[0]);
		isActive = true;
		 	return res.json({
		 		isActive
			})

		// if(subscription.status === 'active' || subscription.status === 'trialing') {
		//  	isActive = true;
		//  	return res.json({
		//  		isActive
		// 	})
		// }
		// else {
		//  	isActive = false;
		//   return res.json({
		//   	isActive
		// 	})
		// }
	}
	catch(err) {
		isActive = false;
	  return res.json({
		  	isActive
		})
	}
})

module.exports = router;