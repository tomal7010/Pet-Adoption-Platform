import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminAllPets = () => {
  const axiosSecure = useAxiosSecure();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axiosSecure.get('/admin/pets')
      .then(res => setPets(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const handleDelete = (id) => {
    axiosSecure.delete(`/admin/pets/${id}`)
      .then(res => {
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Pet has been deleted.", "success");
          setPets(pets.filter(pet => pet._id !== id));
        }
      });
  };

  const handleStatusChange = (id, adopted) => {
    axiosSecure.patch(`/admin/pets/${id}/status`, { adopted })
      .then(() => {
        Swal.fire("Updated!", "Pet status updated.", "success");
        setPets(pets.map(p => p._id === id ? { ...p, adopted } : p));
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl text-red-500 text-center font-bold mb-4">All Pets Data List</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map(pet => (
            <tr key={pet._id}>
              <td>{pet.petName}</td>
              <td>{pet.type}</td>
              <td>{pet.adopted ? "Adopted" : "Not Adopted"}</td>
              <td>
                <button className="btn btn-sm btn-error mr-2" onClick={() => handleDelete(pet._id)}>Delete</button>
                <button
                  className="btn btn-sm"
                  onClick={() => handleStatusChange(pet._id, !pet.adopted)}
                >
                  {pet.adopted ? "Mark Not Adopted" : "Mark Adopted"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllPets;
