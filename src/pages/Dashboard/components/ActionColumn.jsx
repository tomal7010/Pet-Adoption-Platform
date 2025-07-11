import React from "react";

const ActionColumn = ({ pet, onUpdate, onDelete, onAdopt }) => {
  return (
    <div className="flex gap-2">
      <button onClick={() => onUpdate(pet._id)} className="btn btn-xs">
        Update
      </button>
      <button
        onClick={() => onDelete(pet._id)}
        className="btn btn-xs btn-error"
      >
        Delete
      </button>
      {!pet.adopted && (
        <button
          onClick={() => onAdopt(pet._id)}
          className="btn btn-xs btn-success"
        >
          Mark Adopted
        </button>
      )}
    </div>
  );
};

export default ActionColumn;
