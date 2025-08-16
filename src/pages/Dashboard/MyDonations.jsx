import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await axiosSecure.get('/api/donation-campaigns');
        const campaigns = res.data || [];

        // filter only campaigns where this user has donated
        const myDonations = campaigns.filter(campaign =>
          campaign.donors?.some(d => d.email === user.email)
        );

        setDonatedCampaigns(myDonations);
      } catch (error) {
        console.error("Error loading donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [user?.email, axiosSecure]);

  const handleRefund = async (campaignId) => {
    try {
      const res = await axiosSecure.patch(`/api/donation-campaigns/${campaignId}/refund`, {
        email: user.email
      });

      if (res.data?.modifiedCount > 0) {
        Swal.fire('Refunded!', 'Your donation has been refunded.', 'success');
        setDonatedCampaigns(prev => 
          prev.map(c => c._id === campaignId ? {
            ...c,
            donors: c.donors.filter(d => d.email !== user.email),
            donatedAmount: c.donatedAmount - (
              c.donors.find(d => d.email === user.email)?.amount || 0
            )
          } : c)
        );
      } else {
        Swal.fire('Error', 'Refund failed.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Refund error', 'error');
    }
  };

  if (loading) return <div className="text-center py-20">


    <span className="loading loading-bars loading-xs"></span>
    <span className="loading loading-bars loading-sm"></span>
    <span className="loading loading-bars loading-md"></span>
    <span className="loading loading-bars loading-lg"></span>
    <span className="loading loading-bars loading-xl"></span>


  </div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">My Donations</h2>
      {donatedCampaigns.length === 0 ? (
        <p className="text-center text-gray-500">You haven't donated to any campaign yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Pet Image</th>
                <th>Pet Name</th>
                <th>Donated Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donatedCampaigns.map((campaign, index) => {
                const userDonation = campaign.donors.find(d => d.email === user.email);
                return (
                  <tr key={campaign._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={campaign.image} alt={campaign.petName} className="w-16 h-16 rounded" />
                    </td>
                    <td className='capitalize'>{campaign.petName}</td>
                    <td className="text-green-600 font-semibold">${userDonation?.amount}</td>
                    <td>
                      <button
                        onClick={() => handleRefund(campaign._id)}
                        className="btn btn-error btn-xs"
                      >
                        Ask for Refund
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
