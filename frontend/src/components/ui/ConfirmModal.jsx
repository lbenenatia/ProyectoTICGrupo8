import React from "react";
import Button from "./Button";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
        <p className="text-sm text-gray-700 text-center mt-2">{message}</p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 text-black"
          >
            Cancelar
          </button>

          <Button
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
