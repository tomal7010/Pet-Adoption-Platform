import React from "react";
import { Dialog } from "@headlessui/react";

const DonatorsModal = ({ isOpen, onClose, donators = [] }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">Donators</Dialog.Title>
          {donators.length === 0 ? (
            <p className="text-gray-500">No donations found.</p>
          ) : (
            <ul className="space-y-2">
              {donators.donors.map((donator, index) => (
                <li key={index} className="flex justify-between">
                  <span>{donator.name || donator.email}</span>
                  <span>{donator.amount}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onClose}
            className="btn btn-sm mt-4 bg-red-500 text-white"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DonatorsModal;
