import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router"; 
import Navbar from "../../components/Navbar";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 

const DonationCampaigns = () => {
  const axiosSecure = useAxiosSecure(); 
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  const limit = 9;

  const fetchCampaigns = async () => {
    if (fetchingRef.current || !hasMore) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await axiosSecure.get(`/donation-campaigns?limit=${limit}&skip=${skip}`); 

      if (res.data.length < limit) setHasMore(false);

      setCampaigns(prev => {
        const existingIds = new Set(prev.map(c => c._id));
        const newItems = res.data.filter(c => !existingIds.has(c._id));
        return [...prev, ...newItems];
      });

      setSkip(prev => prev + limit);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (isBottom && !loading && hasMore) {
        fetchCampaigns();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Donation Campaigns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
              <img
                src={campaign.image}
                alt={campaign.petName}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <div className="text-center">
                <h3 className="text-xl font-semibold">{campaign.petName}</h3>
                <p className="text-sm text-gray-600 mt-1">Max Donation: ${campaign.maxDonation}</p>
                <p className="text-sm text-gray-600">Donated: ${campaign.donatedAmount}</p>
                <Link
                  to={`/donation-campaigns/${campaign._id}`}
                  className="mt-3 inline-block text-sm bg-primary text-white px-4 py-1 rounded hover:bg-primary/80"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="text-center mt-6 text-gray-500">Loading more...</p>}
        {!hasMore && !loading && <p className="text-center mt-6 text-gray-400">No more campaigns.</p>}
      </div>
    </div>
  );
};

export default DonationCampaigns;
