const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function simulateWebhook() {
  const mockEvent = {
    type: 'checkout.session.completed',
    data: {
      object: {
        client_reference_id: 'test-user-id',
        customer: 'cus_test123',
        subscription: 'sub_test456'
      }
    }
  };

  console.log('Simulated Webhook Event:', mockEvent);
}

simulateWebhook();