import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdoptionRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch adoption requests for pets added by the logged-in user
  const { data: requests = [], refetch } = useQuery({
    queryKey: ['adoption-requests', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/adoption-requests?email=${user.email}`);
      return res.data;
    },
  });

  // Handle status change (accept / reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/api/adoption-requests/${id}`, {
        status: newStatus,
      });

      if (res.data?.modifiedCount > 0) {
        Swal.fire('Success', `Request ${newStatus}ed!`, 'success');
        refetch();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">Adoption Requests</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Pet</th>
              <th>Pet Name</th>
              <th>Requester</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={req.petImage} alt={req.petName} className="w-80 h-14 rounded" />
                </td>
                <td className='capitalize'>{req.petName}</td>
                <td>{req.userName}</td>
                <td>{req.userAdoptRequestEmail}</td>
                <td>{req.phone}</td>
                <td>{req.address}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      req.status === 'accepted'
                        ? 'bg-green-600'
                        : req.status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="flex gap-2  ">
                  <button
                    onClick={() => handleStatusUpdate(req._id, 'accepted')}
                    disabled={req.status !== 'pending'}
                    className="btn btn-xs btn-success "
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(req._id, 'rejected')}
                    disabled={req.status !== 'pending'}
                    className="btn btn-xs btn-error"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  No adoption requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequest;
