const express = require('express');

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
	const { title } = req.params;
	let isFound = false;

	try {
		let opt1 = selectFunction(
			"select * from videos where title LIKE %"
			.concat(`${title}`)
			.concat("%")
		);

		request(opt1, (error, response) => {
			if (error) throw new Error(error);
			else {
				let z = JSON.parse(response.body);

				if(z !== null && z[0] !== undefined) {
					// console.log(z[0]);
					// fetch video data
					isFound = true;
					return res.json({ isFound, data: z[0] });
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
