const stripe = require('stripe');
// const STRIPE_SECRET_KEY = 'sk_test_51Mh4xmSBkYpjR2KPbQizwOH8RDvDRpwmpWEaVOZF8z0txrJIhnpMpjdPgECqZ8FRUi9HUgNOCfG29T4FYwAZbZ0y00K3xYonjV'

const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27'
});

const addNewCustomer = async (email) => {
	const customer = await Stripe.customers.create({
		email: email,
		description: 'New Customer'
	}) 

	return customer;
}

const getCustomerByID = async (id) => {
	const customer = await Stripe.customers.retrieve(id); 
	return customer;
}

const createCheckoutSession = async (customer, price) => {
  const session = await Stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/v1/success`, // => http://localhost:3000
		cancel_url: 'http://localhost:3000' + '/v1/cancel'
  });

  return session;
};

const retrieveSubscription = async (sub_id) => {
	const session = await Stripe.subscriptions.retrieve(sub_id);

	return session;
}

const updateSubscription = async (sub_id, plan_id) => {
	const session = await Stripe.subscriptions.update(
		sub_id,
		{
			metadata: {
				order_id: plan_id
			}
		}
	);

	return session;
}

const listSubscription = async () => {
	const subscriptions = await Stripe.subscriptions.list({
		status: 'active'
	})

	return subscriptions;
}

const cancelSubscription = async (sub_id) => {
	const session = await Stripe.subscriptions.del(sub_id);

	return session;
}

module.exports = {
	addNewCustomer,
	getCustomerByID,
	createCheckoutSession,
	retrieveSubscription,
	updateSubscription,
	cancelSubscription,
	listSubscription
}