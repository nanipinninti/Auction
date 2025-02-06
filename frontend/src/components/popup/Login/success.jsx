
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Success</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col items-center my-4">
          <div className="bg-green-500 rounded-full p-2">✅</div>
          <p className="text-gray-600 text-center mt-2">
            Check your email for a booking confirmation. We’ll see you soon!
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
