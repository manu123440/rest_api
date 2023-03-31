const express = require('express');

const request = require("request-promise-any");

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

router.post('/episodes', async (req, res, next) => {
	let { title } = req.query;
	const email = req.body.email;

  let opt1 = selectFunction(
    "select session_id from users where email = '"
    .concat(`${email}`)
    .concat("'")
  );

	let isExpired = false;

	try {
		request(opt1, async (error, response) => {
      if (error) throw new Error(error);
      else {
        let z = JSON.parse(response.body);

        if(z !== null && z[0] !== undefined) {
          const session_id = z[0].session_id;
          const session = await stripe.checkout.sessions.retrieve(session_id);

          if(session.subscription !== null) {
						const sub_id = session.subscription;

	  				const subscription = await Stripe.retrieveSubscription(sub_id);

	  				// console.log(subscription.status, subscription.cancel_at_period_end);

						if(subscription.cancel_at_period_end !== true) {
				      if(subscription.status === 'active' || subscription.status === 'trialing') {
						    let opt2 = selectFunction(
									"select * from videos where title LIKE '%"
									.concat(`${title}`)
									.concat("%'")
								);

								request(opt2, (error, response) => {
						      if (error) throw new Error(error);
									else {
									  let z = JSON.parse(response.body);
									  // console.log(z);

									  if (z !== null) {
									    isExpired = false;
									   	// fetch video data
											return res.json({ isExpired, data: z });
									  }
									  else {
											isExpired = false;
											return res.json({ isExpired, data: [] });
										}
									}
								});
							}
							else {
								isExpired = true;
								return res.json({ isExpired });
							}
						}
						else {
							isExpired = true;
							return res.json({ isExpired });
						}
	  			}
	  			else {
						isExpired = true;
						return res.json({ isExpired });
					}
        }
        else {
					isExpired = true;
					return res.json({ isExpired });
				}
      }
    });
	} 
	catch(err) {
		console.log(err);
		isExpired = true;
		return res.json({ isExpired });
	}
})

module.exports = router;