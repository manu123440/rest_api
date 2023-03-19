const express = require('express');

const request = require('request-promise-any');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

router.post('/checkSubscription',async (req, res, next) => {
	const sub_id = req.body.sub_id;
	let isActive = false;

	try {
		const subscription = await Stripe.retrieveSubscription(sub_id);
		// console.log(subscription);
		if(subscription.status === 'active' || subscription.status === 'trialing') {
		 	isActive = true;
		 	return res.json({
		 		isActive
			})
		}
		else {
		 	isActive = false;
		  return res.json({
		  	isActive
			})
		}
	}
	catch(err) {
		isActive = false;
	  return res.json({
		  	isActive
		})
	}
})

module.exports = router;