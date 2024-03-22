<br/>
<p align="center">
  <h3 align="center">LMS Static Astro</h3>

  <p align="center">
    Simple LMS whith authentification, payment and static site with Astro
    <br/>
    <br/>
  </p>
</p>



## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)

## About The Project

This project is testing a way to quickly create an LMS at the lowest possible cost.

### How can we do it ?

For the site, we create an Astro JS project. It allows us to create a completely static site with high performance for an SEO strategy.

What's more, a completely static site has extremely low hosting costs.

Videos can be privately hosted on youtube.

Now to manage authentication and a payment system we need a server.

### This is where we can use the serverless function

1. This project used Netlify. Netlify has an authentication system. When someone wants to register, the project launches a script in serverless function that creates a client on stripe, then registers the stripeID and NetlifyID in an external database. FaunaDB


2. When the person wishes to purchase a training course, a new script in serverless functionis launched. It takes the NetlifyID and searches for the StripeID in the FaunaDB database. Then it creates a stripe payment session and returns it to the customer.

3. Then stripe sends a webhook which launches another script ( serverless function ) that updates the data in the FaunaDB database.


### Now the problem is that the site is entirely static. Nothing dynamic.

Astro JS we simply creates 2 roots with the same structure and data, but not the same display.

One for the free version and the other for the pay version.

Example Free: /formation Paid: /formation-pro

Now we just need to protect the paying root.

To do this, we'll use a new script in serverless function as middleware

This script will check that the person is a user with the NetlifyID and, above all, that he's on the paid plan, by checking the database

If not, we'll return him to the free root

## Built With

Astro v2.9 Neltify FaunaDB Stripe

