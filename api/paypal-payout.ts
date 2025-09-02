import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPayout } from '../services/paypalPayouts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { receiver_email, amount, currency, note } = req.body;
    if (!receiver_email || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const payoutResult = await sendPayout(receiver_email, amount, currency || 'USD', note || '');
    res.status(200).json(payoutResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'PayPal payout failed' });
  }
}
