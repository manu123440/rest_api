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

let updateFunction = (item, item2) => {
	let options = {
	    method: "POST",
	    url: "https://itslocaltv.io/api/update.php",
	    formData: {
	      update_query: item,
	      select_query: item2,
	    },
  	};
  return options;
};

router.post('/cancelSubscription', async (req, res, next) => {
	const email = req.body.email;

	let opt1 = selectFunction(
	    "select session_id from users where email = '"
	    .concat(`${email}`)
	    .concat("'")
	);
	let isCanceled = false;

	try {
		request(opt1, async (error, response) => {
      if (error) throw new Error(error);
      else {
       	let z = JSON.parse(response.body);

       	if(z !== null && z[0] !== undefined) {
       		const session_id = z[0].session_id;
       		const session = await stripe.checkout.sessions.retrieve(session_id);
       		const sub_id = session.subscription;

       		if (sub_id !== null) {
	       		const subscription = await Stripe.retrieveSubscription(sub_id);

						if(subscription.status !== 'canceled') {
							const cancelSub = await Stripe.cancelSubscription(sub_id);
							if(cancelSub.status === 'canceled') {
								let opt2 = updateFunction(
						  		"update users SET session_id = 'null', plan = 'null', subs_date = 'null'"
						  		.concat("where email = '")
						  		.concat(`${email}`)
						  		.concat("'"),
						  		"select * from users where email = '"
						        .concat(`${email}`)
						        .concat("'")
						  	)
						  	// console.log(opt2);
						  	request(opt2, async (error, response) => {
							    if (error) throw new Error(error);
							    else {
							     	let y = JSON.parse(response.body);

							     	// console.log(y);

							     	if(y !== null && y[0] !== undefined) {
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
							  });
							}
							else {
								isCanceled = false;
								return res.json({
									isCanceled
								})
							}
						}
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
    })
	}
	catch(err) {
		isCanceled = false;
		return res.json({
			isCanceled
		})
	}

})

module.exports = router;
