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
  const [sortOrder, setSortOrder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter by search term
  const filteredCampaigns = campaigns.filter(c =>
    c.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort campaigns
  const sortedCampaigns = sortOrder === "all"
    ? filteredCampaigns
    : [...filteredCampaigns].sort((a, b) =>
        sortOrder === "asc" ? a.maxDonation - b.maxDonation : b.maxDonation - a.maxDonation
      );

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Donation Campaigns</h2>

        {/* Search + Sorting */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by pet name..."
            className="border p-2 rounded w-full sm:flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full sm:w-52"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="all">All</option>
            <option value="asc">Max Donation: Low to High</option>
            <option value="desc">Max Donation: High to Low</option>
          </select>
        </div>

        {/* Campaign cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col"
            >
              <img
                src={campaign.image}
                alt={campaign.petName}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <div className="text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{campaign.petName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Max Donation: ${campaign.maxDonation}
                  </p>
                  <p className="text-sm text-gray-600">
                    Donated: ${campaign.donatedAmount}
                  </p>
                </div>
                <Link
                  to={`/donation-campaigns/${campaign._id}`}
                  className="mt-3 inline-block text-sm bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {loading && <p className="text-center mt-6 text-gray-500">


            <span className="loading loading-bars loading-xs"></span>
            <span className="loading loading-bars loading-sm"></span>
            <span className="loading loading-bars loading-md"></span>
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-xl"></span>
          
          
          </p>}
        {!hasMore && !loading && <p className="text-center mt-6 text-gray-400">No more campaigns.</p>}
      </div>
    </div>
  );
};

export default DonationCampaigns;
