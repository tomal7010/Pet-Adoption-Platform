import React from "react";
import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300 shadow-lg"
          >
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
