import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminUsersPage = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get("/api/users/all-users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [axiosSecure]);

  const handleMakeAdmin = (userId) => {
    axiosSecure.patch(`/api/users/make-admin/${userId}`)
      .then(res => {
        if (res.data.modifiedCount > 0) {
          Swal.fire("Success", "User is now Admin", "success");
          setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
        }
      })
      .catch(err => {
        Swal.fire("Error", err.message, "error");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-red-600">All Users</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <img src={user.image || "/default-avatar.png"} className="w-12 h-12 rounded-full" alt="" />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" ? (
                    <button onClick={() => handleMakeAdmin(user._id)} className="btn btn-xs btn-primary">
                      Make Admin
                    </button>
                  ) : (
                    <span className="text-green-500">Already Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
