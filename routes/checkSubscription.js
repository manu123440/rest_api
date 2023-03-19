const express = require('express');

const request = require('request-promise-any');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: "https://itslocaltv.io/api/select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

router.post('/checkSubscription',async (req, res, next) => {
	const email = req.body.email;

	let opt1 = selectFunction(
	    "select session_id from users where email = '"
	    .concat(`${email}`)
	    .concat("'")
	);
	
	let isActive = false;

	try {
		request(opt1, async (error, response) => {
      		if (error) throw new Error(error);
      		else {
        		let z = JSON.parse(response.body);

        		if(z !== null && z[0] !== undefined) {
        			const session_id = z[0].session_id;
        			const session = await stripe.checkout.sessions.retrieve(session_id);
        			const sub_id = session.subscription;
        			// console.log(sub_id);

        			const subscription = await Stripe.retrieveSubscription(sub_id);
					// console.log(subscription.current_period_start, subscription.current_period_end);
					const start = subscription.current_period_start * 1000;
					const end = subscription.current_period_end * 1000;
					const startDate = new Date(start).getTime();
					const endDate = new Date(end).getTime();
					const diffTime = endDate - startDate;
					const daysLeft = diffTime / (1000 * 60 * 60 * 24);
					// console.log(daysLeft);

					if(subscription.status === 'active' || subscription.status === 'trialing') {
					 	isActive = true;
					 	return res.json({
					 		isActive,
					 		daysLeft
						})
					}
					else {
					 	isActive = false;
					  	return res.json({
					  		isActive
						})
					}
        		}
        		else {
					isActive = false;
					return res.json({
					  	isActive
					})
				}
        	}
        })
	}
	catch(err) {
		isActive = false;
	  	return res.json({
		  	isActive
		})
	}

})

module.exports = router;
