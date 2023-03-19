const express = require('express');

const request = require('request-promise-any');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

router.post('/cancelSubscription', async (req, res, next) => {
	const sub_id = req.body.sub_id;
	let isCanceled = false;

	try {
		const subscription = await Stripe.retrieveSubscription(sub_id);

		if(subscription.status !== 'canceled') {
			const cancelSub = await Stripe.cancelSubscription(sub_id);
			if(cancelSub.status === 'canceled') {
				isCanceled = true;
				return res.json({
					isCanceled
				})
			}
			else {
				isCanceled = false;
				return res.json({
					isCanceled
				})
			}
		}
		else {
			isCanceled = false;
			return res.json({
				isCanceled
			})
		}
	}
	catch(err) {
		isCanceled = false;
		return res.json({
			isCanceled
		})
	}

})

module.exports = router;