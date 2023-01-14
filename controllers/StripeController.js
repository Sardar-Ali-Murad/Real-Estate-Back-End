import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51L3igsAX34JgbNaA19MxqmKDjvdslkw99t2XIaGTNN7ZmEH1yoBZZ4fJ5pePpG5m354ky6L04OUZx2U4RijU3k7p00EwcGMp4J");

const YOUR_DOMAIN = 'http://localhost:3000'

const getStripe=async (req,res)=>{
    if (req.method === 'POST') {
      try {
        const params = {
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: req.body.cartItems.map((item) => {
            return {
              price_data: { 
                currency: 'usd',
                product_data: { 
                  name: item.product.name,
                images:[item.product.image]
                },
                unit_amount: item.product.price * 100,
              },
              adjustable_quantity: {
                enabled:true,
                minimum: 1,
              },
              quantity: item.quantity || 1
            }
          }),
          success_url: `${YOUR_DOMAIN}/orderSuccess`,
          cancel_url: `${YOUR_DOMAIN}/orderCanceled`
        }
  
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);
  
        res.status(200).json(session);
      } 
      catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }  
}

export {getStripe}