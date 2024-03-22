import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { faunaFetch } from './utils/fauna.js';

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  // create a new customer in Stripe
  const customer = await stripe.customers.create({ email: user.email, name: user.user_metadata.full_name });

  await faunaFetch({
    query: `
      mutation ($netlifyID: ID!, $stripeID: ID!,$name: String!,$email: String!,$productName: String!) {
        createUser(data: { netlifyID: $netlifyID, stripeID: $stripeID, name: $name, email: $email, productName: $productName }) {
          netlifyID
          stripeID
          name
          email
          productName
        }
      }
    `,
    variables: {
      netlifyID: user.id,
      stripeID: customer.id,
      name: user.user_metadata.full_name,
      email: user.email,
      productName: "Automa",
    },
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['free'],
      },
    }),
  };
};