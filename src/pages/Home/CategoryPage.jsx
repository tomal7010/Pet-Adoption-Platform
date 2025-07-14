import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';

const CategoryPage = () => {
  const axiosInstance = useAxios();
  const { type } = useParams(); 
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("URL param (type):", type); 

    axiosInstance.get('/preview-pets')
      .then(res => {
        console.log("API Response:", res.data); 

        const filtered = res.data.filter(pet =>
          pet?.type?.toLowerCase() === type?.toLowerCase()
        );

        console.log("Filtered Pets:", filtered); 

        setPets(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pets:', err);
        setLoading(false);
      });
  }, [type, axiosInstance]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold capitalize mb-6">{type} Available</h1>

      {pets.length === 0 ? (
        <p>No {type} found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pets.map(pet => (
            <div key={pet._id} className="border p-4 rounded shadow hover:shadow-md transition">
              <img
                src={pet.petImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={pet.petName}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <div className='text-center'>
              <h2 className="text-xl font-semibold capitalize">{pet.petName}</h2>
              <p className="text-sm text-gray-600">Age: {pet.age}</p>
              <p className="text-sm text-gray-600 capitalize">Type: {pet.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
