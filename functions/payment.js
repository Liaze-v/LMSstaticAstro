import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import fetch from 'node-fetch';
import { faunaFetch } from './utils/fauna.js';

exports.handler = async ({ body, headers }, context) => {

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    if (stripeEvent.type !== 'checkout.session.completed') return;
    const subscription = stripeEvent.data.object;
    if (subscription.payment_status !== 'paid') return;

    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        stripeEvent.data.object.id,
        {
          expand: ['line_items'],
        }
      );
    const lineItems = sessionWithLineItems.line_items;
    const price = sessionWithLineItems.line_items.data[0].price;

    const result = await faunaFetch({
      query: `
          query ($stripeID: ID!,$email: String!) {
            getUserByStripeIDAndEmail(stripeID: $stripeID,email: $email) {
              netlifyID
            }
          }
        `,
      variables: {
        stripeID: subscription.customer,
        email: subscription.customer_details.email,
      },
    });

    const { netlifyID } = result.data.getUserByStripeIDAndEmail;
    let role= "";
	switch (price.id) {
		case 'price_':
			role = 'pro';
			break;
		case 'price_':
			role = 'free';
			break;
        }
    const { identity } = context.clientContext;
    await fetch(`${identity.url}/admin/users/${netlifyID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
      body: JSON.stringify({
        app_metadata: {
          roles: [role],
        },
      }),
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};