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

router.post('/listSession', async (req, res, next) => {
	const email = req.body.email;
	let isActive = false;

	let opt1 = selectFunction(
	    "select session_id from users where email = '"
	      .concat(`${email}`)
	      .concat("'")
	);

	try {
		request(opt1, (error, response) => {
	      	if (error) throw new Error(error);
	      	else {
	        	let z = JSON.parse(response.body);
	        	if (z !== null && z[0] !== undefined) {
	        		// console.log(z[0]);
	        		isActive = true;
					return res.json({
						isActive,
					 	sessionId: z[0].session_id
					})
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