/*import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAxios from '../../hooks/useAxios';

const DonateModal = ({ campaign, setShowModal }) => {
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const axiosInstance = useAxios();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (amount && parseInt(amount) > 0) {
      axiosInstance
        .post('/create-payment-intent', { amount: parseInt(amount) })
        .then(res => setClientSecret(res.data.clientSecret));
    }
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: 'Anonymous',
        },
      },
    });

    if (result.paymentIntent?.status === 'succeeded') {
      alert('Donation successful!');
      setShowModal(false);
    } else {
      alert('Payment failed!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Donate to {campaign.petName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <CardElement />
          <button type="submit" className="btn btn-primary w-full" disabled={!stripe}>
            Donate
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default DonateModal;

*////////////////////////////////////////////

import React, { useEffect, useState, useContext } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useAxios from '../../hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../contexts/AuthProvider';
//import { AuthContext } from '../../contexts/AuthProvider';

const DonateModal = ({ campaign, setShowModal }) => {
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const axiosInstance = useAxios();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Create Stripe PaymentIntent when amount entered
  useEffect(() => {
    if (amount && parseInt(amount) > 0) {
      axiosInstance
        .post('/create-payment-intent', { amount: parseInt(amount) })
        .then(res => setClientSecret(res.data.clientSecret));
    }
  }, [amount]);

  // Mutation to save donor info to backend
  const mutation = useMutation({
    mutationFn: (donationInfo) =>
      axiosInstance.post(`/donation-campaigns/${campaign._id}/donate`, donationInfo),
    onSuccess: () => {
      queryClient.invalidateQueries(); // This will refetch queries (optional: you can specify key)
    },
  });

  // Handle payment submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user?.displayName || 'Anonymous',
          email: user?.email || 'unknown@example.com',
        },
      },
    });

    if (result.paymentIntent?.status === 'succeeded') {
      // Save donor info to backend
      const donationData = {
        name: user?.displayName || 'Anonymous',
        email: user?.email || 'unknown@example.com',
        amount: parseInt(amount),
        date: new Date().toISOString(),
      };

      mutation.mutate(donationData);

      alert('Donation successful!');
      setShowModal(false);
    } else {
      alert('Payment failed!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Donate to {campaign.petName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <CardElement />
          <button type="submit" className="btn btn-primary w-full cursor-pointer" disabled={!stripe}>
            Donate
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default DonateModal;