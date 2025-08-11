import Stripe from 'stripe';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const stripeSecret = process.env.STRIPE_SECRET || process.env.STRIPE_KEY;
const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
  }

  const { items, currency = 'uah', successUrl, cancelUrl } = data || {};
  if (!Array.isArray(items) || items.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Items required');
  }

  const line_items = items.map((it) => ({
    price_data: {
      currency,
      product_data: { name: it.title },
      unit_amount: Math.round(Number(it.unitPrice ?? it.price) * 100),
    },
    quantity: Number(it.count ?? 1),
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { uid: context.auth.uid },
  });

  return { id: session.id, url: session.url };
});

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    if (uid) {
      const userOrders = admin.firestore().collection('users').doc(uid).collection('orders');
      const snap = await userOrders.where('payment.sessionId', '==', session.id).limit(1).get();
      if (!snap.empty) {
        const ref = snap.docs[0].ref;
        await ref.update({ 'payment.status': 'paid', status: 'paid' });
      }
    }
  }

  res.json({ received: true });
});


