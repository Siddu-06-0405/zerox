const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p className="text-center text-lg text-black font-semibold">{message}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
            onClick={onConfirm}
          >
            OK
          </button>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
