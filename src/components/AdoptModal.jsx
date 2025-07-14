import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxios from '../hooks/useAxios';


const AdoptModal = ({ pet, user, onClose }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const axiosInstance = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adoptionData = {
      petId: pet._id,
      userPostEmai: pet.userPostEmail,
      userPostName: pet.userPostName,      
      petName: pet.petName,
      petImage: pet.petImage || pet.imageUrl,
      userName: user.name,
      userAdoptRequestEmail: user.email,
      phone,
      address,
      status: 'pending',
    };

    try {
      const res = await axiosInstance.post('/adopt', adoptionData);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Request Sent!',
          text: 'Your adoption request has been submitted.',
        });
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not send your request.',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while submitting.',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">Adopt {pet.petName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Your Name</label>
            <input
              value={user.name}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm">Phone</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

export default AdoptModal;
