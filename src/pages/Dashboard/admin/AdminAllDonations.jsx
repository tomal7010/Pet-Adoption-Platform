import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminAllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axiosSecure.get("/api/admindonation-campaigns")
      .then(res => {
        setCampaigns(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [axiosSecure]);

  const handlePauseToggle = (id, currentStatus) => {
    axiosSecure.patch(`/api/admindonationStatus/${id}`, { donate: !currentStatus })
      .then(res => {
        if (res.data.modifiedCount > 0) {
          Swal.fire("Updated!", "Donation campaign status changed.", "success");
          setCampaigns(prev => prev.map(item =>
            item._id === id ? { ...item, donate: !currentStatus } : item
          ));
        }
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the campaign permanently!",
      icon: "warning",
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/api/donation-campaigns/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "Campaign has been removed.", "success");
              setCampaigns(prev => prev.filter(item => item._id !== id));
            }
          });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Donation Campaigns</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Campaign Email</th>
              <th>Status</th>
              <th>Pause/Unpause</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={campaign._id}>
                <td>{index + 1}</td>
                <td>{campaign.userDonationPostEmail}</td>
                <td>{campaign.donate ? "Paused" : "Active"}</td>
                <td>
                  <button
                    onClick={() => handlePauseToggle(campaign._id, campaign.donate)}
                    className="btn btn-sm btn-warning"
                  >
                    {campaign.donate ? "Unpause" : "Pause"}
                  </button>
                </td>
                <td>
                  <Link to={`/dashboard/admin-edit-donation/${campaign._id}`}>
                    <button className="btn btn-sm btn-info">Edit</button>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(campaign._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllDonations;
