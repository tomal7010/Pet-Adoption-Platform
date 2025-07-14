import React, { useEffect, useState, useContext } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../contexts/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const DonateModal = ({ campaign, setShowModal }) => {
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (amount && parseInt(amount) > 0) {
      axiosSecure
        .post('/create-payment-intent', { amount: parseInt(amount) })
        .then(res => setClientSecret(res.data.clientSecret));
    }
  }, [amount, axiosSecure]);

  const mutation = useMutation({
    mutationFn: (donationInfo) =>
      axiosSecure.post(`/donation-campaigns/${campaign._id}/donate`, donationInfo),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

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
      const donationData = {
        name: user?.displayName || 'Anonymous',
        email: user?.email || 'unknown@example.com',
        amount: parseInt(amount),
        date: new Date().toISOString(),
      };

      mutation.mutate(donationData);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Donation Successful!',
        showConfirmButton: false,
        timer: 1500,
      });

      setShowModal(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: result.error?.message || 'Something went wrong. Please try again.',
      });
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

