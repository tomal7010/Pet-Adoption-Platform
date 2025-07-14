import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import useAxios from "../../hooks/useAxios";
import Navbar from "../../components/Navbar";
import AdoptModal from "../../components/AdoptModal"; 
import { AuthContext } from "../../contexts/AuthProvider";
//import { AuthContext } from "../../contexts/AuthContext";

const PetDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axiosInstance.get(`/preview-pets/${id}`);
        setPet(response.data);
      } catch (err) {
        console.error("Error fetching pet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, axiosInstance]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading pet details...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-10 text-red-500">
        Pet not found.
      </div>
    );
  }

  const currentUser = {
    name: user?.displayName || "Anonymous",
    email: user?.email || "noemail@example.com",
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto px-5 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">{pet.petName}</h2>

        <img
          src={pet.petImage || pet.imageUrl || "https://via.placeholder.com/400x300"}
          alt={pet.petName}
          className="w-full h-80 object-cover rounded mb-6"
        />

        <div className="text-center">
          <div className="space-y-3 text-lg">
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Type:</strong> {pet.type}</p>
            <p><strong>Location:</strong> {pet.location}</p>
            <p><strong>Description:</strong> {pet.longDesc || "No description provided."}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 bg-green-600 text-white py-2 px-5 rounded hover:bg-green-700 transition cursor-pointer"
          >
            Adopt
          </button>
        </div>
      </div>

      {/* Adopt Modal */}
      {showModal && (
        <AdoptModal
          pet={pet}
          user={currentUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PetDetails;
