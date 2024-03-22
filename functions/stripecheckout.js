
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import fetch from 'node-fetch';
import { faunaFetch } from './utils/fauna.js';



exports.handler = async (_event, context) => {
    const product_wich = JSON.parse(_event.body)
    const { user } = context.clientContext;
    const result = await faunaFetch({
      query: `
        query ($netlifyID: ID!,$email: String!) {
          getUserByNetlifyIDAndEmail(netlifyID: $netlifyID,email: $email) {
            stripeID
          }
        }
      `,
      variables: {
        netlifyID: user.sub,
        email: user.email,
      },
    });
    const { stripeID } = result.data.getUserByNetlifyIDAndEmail;
    const session = await stripe.checkout.sessions.create({
        success_url: 'https://URL.netlify.app/success',
        cancel_url: 'https://URL.netlify.app/cancel',
        customer: stripeID,
        allow_promotion_codes : true,
        custom_fields:[
            
        ],
        invoice_creation: {
          enabled: true,
        },
        line_items: [
          {price: product[product_wich.item[0].id], quantity: 1},
        ],
        mode: 'payment',
      });
    return {
      statusCode: 200,
      body: JSON.stringify(session.url),
    };
  };