require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const handle = async () => {
	const checkSession = await stripe.checkout.sessions.retrieve(
		'cs_test_a19gcWQ5MiDrhD89ghA0bCnjWt0glT1Tzh58lB3qFZgowmoc6njk1DRFpk'
	);
	console.log(checkSession);
};

handle();
