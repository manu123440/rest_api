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

router.post('/searchVideo', (req, res, next) => {
	const { title } = req.query;
	let isFound = false;

	try {
		let opt1 = selectFunction(
			"select * from videos where title LIKE '%"
			.concat(`${title}`)
			.concat("%'")
		);

		request(opt1, (error, response) => {
			if (error) throw new Error(error);
			else {
				let z = JSON.parse(response.body);

				if(z !== null) {
					// console.log(z);
					// fetch video data
					isFound = true;
					return res.json({ isFound, data: z });
				}
				else {
					isFound = false;
					return res.json({ isFound });
				}
			}
		})
	}
	catch(err) {
		console.log(err);
		return res.json({ 'error': true });
	}
})

module.exports = router;
