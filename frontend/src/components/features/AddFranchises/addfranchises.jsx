import { useState, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Cookies from "js-cookie"; // Import Cookies library
import { useParams } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AddFranchises() {
    const [franchises, setFranchises] = useState([]); // State to store all franchises
    const [allFranchises, setAllFranchises] = useState([]); // State to store both initial and selected franchises
    const [loading, setLoading] = useState(true); // Loading state for API call
    const [purse, setPurse] = useState("500000000"); // State for purse value
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
    const [showErrorModal, setShowErrorModal] = useState(false); // Error modal state

    const { auction_id } = useParams(); // Get auction_id from URL

    // Fetch franchises from API
    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                // Fetch all franchises
                const franchisesResponse = await fetch(`${DOMAIN}/franchise/list`);
                const franchisesData = await franchisesResponse.json();

                if (franchisesData.success) {
                    setFranchises(franchisesData.franchises); // Store full franchise data
                } else {
                    console.error("Failed to fetch franchises");
                    setShowErrorModal(true); // Show error modal if API fails
                }

                // Fetch initial franchises for the auction
                const initialFranchisesResponse = await fetch(
                    `${DOMAIN}/auction/franchises?auction_id=${auction_id}`
                );
                const initialFranchisesData = await initialFranchisesResponse.json();

                if (initialFranchisesResponse.ok) {
                    // Convert the object to an array of franchise names
                    const initialFranchisesArray = Object.values(initialFranchisesData).map(
                        (franchise) => franchise.franchise_name
                    );
                    setAllFranchises(initialFranchisesArray); // Set initial franchises
                } else {
                    console.error("Failed to fetch initial franchises");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setShowErrorModal(true); // Show error modal on network error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchFranchises();
    }, [auction_id]); // Fetch data when auction_id changes

    const handleSelection = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !allFranchises.includes(selectedValue)) {
            setAllFranchises([...allFranchises, selectedValue]); // Add new franchise to the list
        }
    };

    const handleDelete = (franchise) => {
        setAllFranchises(allFranchises.filter((item) => item !== franchise)); // Remove franchise from the list
    };

    const handleDeleteAll = () => {
        setAllFranchises([]); // Clear all franchises
    };

    const handleSave = async () => {
        try {
            // Prepare franchiseData for the API call
            const franchiseData = allFranchises.map((franchiseName) => {
                const franchise = franchises.find((f) => f.franchise_name === franchiseName);
                return {
                    franchise_id: franchise._id, // Use the franchise ID from the fetched data
                    total_purse: parseInt(purse, 10), // Convert purse to a number
                };
            });

            // Make the API call
            const response = await fetch(`${DOMAIN}/auction/add-franchises`, {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    auction_id: auction_id, // Use auction_id from URL
                    franchiseData,
                }),
            });

            const data = await response.json();
            if (response.ok){                
                setShowSuccessModal(true)
            }
        } catch (error) {
            console.error("Error saving franchises:", error);
            setShowErrorModal(true); // Show error modal on network error
        }
    };

    return (
        <div className="flex flex-col min-w-[330px]">
            {/* Franchises List */}
            <div className="mt-4 flex flex-col gap-3">
                <div>
                    <h1>Franchise Name</h1>
                </div>
                {/* Display all franchises */}
                {allFranchises.map((franchise, index) => (
                    <div key={index} className="flex">
                        <div className="w-[200px] min-w-[200px] max-w-[200px] p-1 px-2 border border-gray-300 rounded bg-transparent overflow-hidden whitespace-nowrap text-ellipsis">
                            {franchise}
                        </div>
                        <div
                            className="p-2 rounded text-red-500 text-[20px] cursor-pointer"
                            onClick={() => handleDelete(franchise)}
                        >
                            <MdOutlineDelete />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Franchise Dropdown */}
            <div className="mt-5">
                <label htmlFor="franchise">Add a Franchise:</label>
                <select
                    id="franchise"
                    className="block rounded px-2 py-1 mt-2 bg-white border border-gray-300 cursor-pointer text-[14px]"
                    onChange={handleSelection}
                    disabled={loading} // Disable dropdown while loading
                >
                    <option value="">Select a Franchise</option>
                    {franchises.map((franchise, index) => (
                        <option key={index} value={franchise.franchise_name}>
                            {franchise.franchise_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Purse Input */}
            <div className="mt-3">
                <label htmlFor="purse">Purse:</label>
                <input
                    type="text"
                    id="purse"
                    value={purse}
                    onChange={(e) => setPurse(e.target.value)}
                    className="block rounded px-2 py-1 mt-2 bg-white border border-gray-300 text-[14px]"
                />
            </div>

            {/* Buttons */}
            <div className="flex text-[13px] mt-2 gap-2">
                <button
                    className="p-1 px-5 bg-[#60A5FA] text-white rounded"
                    onClick={handleSave}
                >
                    Save
                </button>
                <button
                    className="p-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                    onClick={handleDeleteAll}
                >
                    <MdOutlineDelete className="text-[14px]" /> Delete All
                </button>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4 text-center">
                    <p>Loading franchises...</p>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                    <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                        <h2 className="text-xl font-semibold mb-4">Success</h2>
                        <p className="mb-4">Data was successfully modified.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-screen">
                    <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 mx-[10px]">
                        <h2 className="text-xl font-semibold mb-4">Error</h2>
                        <p className="mb-4">Failed to modify the data.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}