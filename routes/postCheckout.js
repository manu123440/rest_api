const express = require('express');

const request = require("request-promise-any");

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

const products = {
	basic: 'price_1Mn2HzSBkYpjR2KP768PkhED',
	pro: 'price_1Mn2KoSBkYpjR2KP5bl1vJqx'
}

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
}

router.post('/checkout', async (req, res, next) => {
	// console.log(req.body.product);
	const email = req.body.email;

	let productType = req.body.product;
	let product = '';
	let isSCreated = false;

	if(productType === 'pro') {
		product = products.pro;
	}
	else {
		product = products.basic;
	}

	const customer = await stripe.customers.list({
		email: email
	})
	const customerId = customer.data[0].id;

	// console.log(customer);

	const session = await Stripe.createCheckoutSession(
    	customerId,
    	product
  	);

  	const createdAt = new Date(session.created);

  	// console.log(session.id, createdAt);

  	let opt1 = updateFunction(
  		"update users SET session_id = '"
  		.concat(`${session.id}`)
  		.concat("', plan = '")
  		.concat(`${productType}`)
  		.concat("', subs_date = '")
  		.concat(`${createdAt}`)
  		.concat("' where email = '")
  		.concat(`${email}`)
  		.concat("'"),
  		"select * from users where email = '"
        .concat(`${email}`)
        .concat("'")
  	)

  	try {
  		request(opt1, function (error, response) {
	        if (error) throw new Error(error);
	        else {
	          	let x = JSON.parse(response.body);
	          	// console.log(x);

	          	if(x !== null && x[0] !== undefined) {
	          		// console.log(x[0]);
	          		isSCreated = true;
				return res.json({ isSCreated, sessionId: x[0].session_id });
	          	}
	          	else {
	          		isSCreated = false;
  					return res.json({ isSCreated });
	          	}
	      	}
      	});
  	}
  	catch(err) {
  		console.log(err);
  		isSCreated = false;
  		return res.json({ isSCreated });
  	}
})

module.exports = router;
