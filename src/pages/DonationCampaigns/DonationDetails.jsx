import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DonateModal from './DonateModal';

const DonationDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axiosInstance.get(`/donation-campaigns/${id}`);
        setCampaign(res.data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id, axiosInstance]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <img src={campaign.petImage} alt={campaign.petName} className="w-96 h-52 rounded-lg mb-6" />
        <h2 className="text-3xl font-bold">{campaign.petName}</h2>
        <p className="mt-2 text-gray-600">Max Donation: ${campaign.maxDonation}</p>
        <p className="text-gray-600">Already Donated: ${campaign.donatedAmount}</p>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-primary text-white px-4 py-2 rounded cursor-pointer"
        >
          Donate Now
        </button>

        {showModal && (
          <DonateModal
            onClose={() => setShowModal(false)}
            campaign={campaign}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DonationDetails;
