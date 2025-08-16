import { Link, NavLink, Outlet } from "react-router";
import { FaBars, FaPaw, FaDog, FaCat, FaFish, FaUserShield, FaUsers, FaDonate } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setRole(res.data.role))
        .catch((err) => console.error("Role fetch error:", err));
    }
  }, [user, axiosSecure]);

  return (
    <div>
      <Navbar />
      <div className="drawer drawer-mobile lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex p-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden self-start mb-4"
          >
            <FaBars className="text-xl" />
          </label>

          <div className="items-center justify-center w-full">
            <Outlet />
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <h1 className="text-center text-3xl pb-3 text-red-600 font-bold">
              Dashboard
            </h1>

            {/* User Links */}
            <li>
              <NavLink
                to="/dashboard/add-pet"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaPaw className="inline-block mr-2" />
                Add Pet
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-added-pets"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaDog className="inline-block mr-2" />
                My Added Pets
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/adoptionrequest"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaCat className="inline-block mr-2" />
                Adoption Request
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/createdonationcampaign"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaDonate className="inline-block mr-2" />
                Create Donation Campaign
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-donation-campaigns"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaDonate className="inline-block mr-2" />
                My Donation Campaigns
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/mydonations"
                onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
              >
                <FaUsers className="inline-block mr-2" />
                My Donations
              </NavLink>
            </li>

            {/* Admin Links */}
            {role === "admin" && (
              <>
                <li className="text-yellow-500  hover:text-yellow-600 font-bold">
                  <NavLink
                    to="/dashboard/adminuserspage"
                    onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
                  >
                    <FaUserShield className="inline-block mr-2" />
                    All Users Data List
                  </NavLink>
                </li>

                <li className="text-yellow-500  hover:text-yellow-600 font-bold">
                  <NavLink
                    to="/dashboard/admin-all-pets"
                    onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
                  >
                    <FaFish className="inline-block mr-2" />
                    All Pets Data List
                  </NavLink>
                </li>

                <li className="text-yellow-500 hover:text-yellow-600 font-bold">
                  <NavLink
                    to="/dashboard/admin-all-donations"
                    onClick={() => { document.getElementById("my-drawer-2").checked = false; }}
                  >
                    <FaDonate className="inline-block mr-2" />
                    All Donations
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
