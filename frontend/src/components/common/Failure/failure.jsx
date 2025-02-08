
const FailureComponent = ({ message = 'An error occurred.', retryAction = null }) => {
  return (
    <div className="bg-red-100 border flex flex-col max-w-[300px] border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Couldn't Load</strong>
      <span className="block sm:inline text-[14px] mt-1">{message}</span>
      {retryAction && (
        <button
          onClick={retryAction}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white  text-[15px] py-1 px-5 rounded-md w-fit"
        >
          Retry
        </button>
      )}
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 20"><title>Close</title><path d="M14.348 14.849a1.2 1-1.697 0L10 11.819l-2.651 3.029a1.2 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.697-1.697L10 8.183l2.651-3.031a1.2 1.697l-2.758 3.15a1.2 1.698z"/></svg>
      </span>
    </div>
  );
};

export default FailureComponent;