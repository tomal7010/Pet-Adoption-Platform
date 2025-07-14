import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyDonationCampaigns = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [showDonorModal, setShowDonorModal] = useState(false);

  const { data: donationcampaigns = [], refetch } = useQuery({
    queryKey: ['my-donationcampaigns', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/my-campaigns?email=${user.email}`);
      return res.data;
    }
  });

  const handleDonationStatus = async (id, currentStatus) => {
    try {
      const res = await axiosSecure.patch(`/api/donationStatus/${id}`, {
        donate: !currentStatus
      });

      if (res.data?.modifiedCount > 0 || res.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Donation has been ${!currentStatus ? 'paused' : 'resumed'}.`,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire('Error', 'Failed to update donation status', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Update failed', 'error');
    }
  };

  const handleViewDonors = (donors = []) => {
    setSelectedDonors(donors);
    setShowDonorModal(true);
  };

  return (
    <div>
      <h1 className="text-center font-bold text-3xl text-red-600 pb-5">My Donation Campaigns</h1>

      <div className="overflow-x-auto shadow-md rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>#</th>
              <th>Pet Name</th>
              <th>Max Donation</th>
              <th>Donation Progress</th>
              <th>Donation Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donationcampaigns.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="capitalize max-w-[180px] truncate">{parcel.petName}</td>
                <td className="capitalize">{parcel.maxAmount}</td>
                <td>
                  <progress
                    className="progress progress-success w-40"
                    value={parcel.donatedAmount}
                    max={parcel.maxDonation}
                  ></progress>
                  <span className="ml-2 text-sm">
                    {Math.round((parcel.donatedAmount / parcel.maxDonation) * 100)}%
                  </span>
                </td>
                <td>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={!parcel.donate}
                      onChange={() => handleDonationStatus(parcel._id, parcel.donate)}
                    />
                    <span className="text-sm">
                      {parcel.donate ? 'Paused / OFF' : 'Unpaused / ON'}
                    </span>
                  </label>
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleViewDonors(parcel.donors)}
                  >
                    View Donators
                  </button>
                </td>
                <td>
                    <button >

                         <Link to={`/dashboard/edit-donation/${parcel._id}`} className="btn btn-sm btn-primary">
                            Edit
                         </Link>
                       
                    </button>
                </td>
              </tr>
            ))}

            {donationcampaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Donors Modal */}
      {showDonorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Donators List</h2>
            {selectedDonors.length > 0 ? (
              <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedDonors.map((donor, idx) => (
                  <li key={idx} className="flex justify-between border-b pb-1">
                    <span>{donor.name}</span>

                    <span>{donor.email}</span>

                    <span className="text-green-600 font-semibold">{donor.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No donations yet.</p>
            )}
            <button
              onClick={() => setShowDonorModal(false)}
              className="mt-4 btn btn-sm btn-error"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
