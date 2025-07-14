import React, { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

const PetListing = () => {
  const axiosInstance = useAxios();
  const [pets, setPets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Cat", "Dog", "Rabbit", "Fish"];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosInstance.get("/preview-pets");
        const data = response.data;
        const availablePets = data.filter((pet) => !pet.adopted);
        setPets(availablePets);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, [axiosInstance]);

  const filteredPets = pets.filter((pet) => {
    const matchCategory =
      selectedCategory === "All" ||
      (pet.type && pet.type.toLowerCase() === selectedCategory.toLowerCase());

    const matchSearch =
      pet.petName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  const navigate = useNavigate();

  const handleViewDetails = (pet) => {
    navigate(`/pets/${pet._id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Available Pets for Adoption
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <select
            className="border p-2 rounded w-full sm:w-52"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search pets by name..."
            className="border p-2 rounded w-full sm:flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPets.length === 0 ? (
          <p className="text-center text-gray-500">No pets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="border p-4 rounded shadow hover:shadow-md transition flex flex-col"
              >
                <img
                  src={
                    pet.petImage ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={pet.petName}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <div className="text-center">
                  <h2 className="text-xl font-semibold capitalize">{pet.petName}</h2>
                  <p className="text-sm text-gray-600">Age: {pet.age}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    Type: {pet.type}
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(pet)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListing;
