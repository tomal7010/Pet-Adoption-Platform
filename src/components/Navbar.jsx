import { Link, NavLink, useNavigate } from 'react-router';
import { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import { AuthContext } from '../contexts/AuthProvider';



const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = (
    <>
      <NavLink to="/" className="hover:text-orange-500">Home</NavLink>
      <NavLink to="/pet-listing" className="hover:text-orange-500">Pet Listing</NavLink>
      <NavLink to="/donation-campaigns" className="hover:text-orange-500">Donation Campaigns</NavLink>
    </>
  );

  return (
    <div className="pb-15">
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8" />
            PetAdopt
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center text-gray-700 font-medium">
            {navLinks}
            {!user ? (
      
              <>
    <NavLink to="/auth/login" className="bg-orange-500 text-white px-4 py-1 rounded">
      Login
    </NavLink>
    <NavLink to="/auth/register" className="border border-orange-500 text-orange-500 px-4 py-1 rounded">
      Register
    </NavLink>
  </>


            ) : (
              <div className="relative">
                <img
                  src={user?.photoURL}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded border z-50">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <img
                src={user?.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full border"
              />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2 text-gray-700 font-medium">
            {user && (
              <div className="flex items-center gap-3 border-b pb-3 mb-2">
                <img src={user?.photoURL} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="font-semibold">{user?.displayName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {navLinks}
              {!user ? (
                <>
    <NavLink to="/auth/login" className="bg-orange-500 text-white px-4 py-1 rounded">
      Login
    </NavLink>
    <NavLink to="/auth/register" className="border border-orange-500 text-orange-500 px-4 py-1 rounded">
      Register
    </NavLink>
  </>
              ) : (
                <>
                  <Link to="/dashboard" className="block hover:text-orange-500">Dashboard</Link>
                  <button onClick={handleLogout} className="block text-left hover:text-orange-500">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
