import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const MyAddedPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 10;

  const {
    data: addedpets = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['my-addedpets', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/my-pets?email=${user.email}`);
      return res.data;
    },
  });

  const handleUpdate = (id) => {
    navigate(`/dashboard/update-pet/${id}`);
  };

  const handleAdopt = async (id) => {
    try {
      const res = await axiosSecure.patch(`/pets/adopt/${id}`, {
        adopted: true,
      });

      if (res.data?.modifiedCount > 0 || res.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Adopted!',
          text: 'The pet has been marked as adopted.',
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire('Error', 'Failed to mark as adopted', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Adoption failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This pet will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/pets/${id}`);
        if (res.data?.deletedCount > 0) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Pet has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          refetch();
        }
      } catch (err) {
        Swal.fire('Error', err.message || 'Failed to delete pet', 'error');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(addedpets.length / petsPerPage);
  const startIndex = (currentPage - 1) * petsPerPage;
  const currentPets = addedpets.slice(startIndex, startIndex + petsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>Serial</th>
            <th>Pet Image</th>
            <th>Pet Name</th>
            <th>Category</th>
            <th>Adoption Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPets.map((addedpet, index) => (
            <tr key={addedpet._id}>
              <td>{startIndex + index + 1}</td>
              <td>
                <img
                  src={addedpet.image}
                  alt={addedpet.name}
                  className="w-20 h-16 object-cover rounded-md"
                />
              </td>
              <td className="capitalize">{addedpet.name}</td>
              <td>{addedpet.type}</td>
              <td>
                {addedpet.adopted ? (
                  <span className="text-red-600 font-medium">Adopted</span>
                ) : (
                  <span className="text-green-600 font-medium">Not Adopted</span>
                )}
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => handleUpdate(addedpet._id)}
                  className="btn btn-xs btn-outline"
                >
                  Update
                </button>
                {!addedpet.adopted && (
                  <button
                    onClick={() => handleAdopt(addedpet._id)}
                    className="btn btn-xs btn-outline"
                  >
                    Adopt
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addedpet._id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {addedpets.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-6">
                No added pets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4 gap-2">
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              onClick={() => handlePageChange(n + 1)}
              className={`btn btn-sm ${currentPage === n + 1 ? 'btn-active btn-primary' : 'btn-outline'}`}
            >
              {n + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;
