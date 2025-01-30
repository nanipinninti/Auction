import { useState, useEffect } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Cookies from "js-cookie"; // Import Cookies library
import { useParams } from "react-router-dom";

export default function AddAuctioneers() {
    const [auctioneers, setAuctioneers] = useState([]); // State to store all auctioneers
    const [allAuctioneers, setAllAuctioneers] = useState([]); // State to store both initial and selected auctioneers
    const [loading, setLoading] = useState(true); // Loading state for API call
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
    const [showErrorModal, setShowErrorModal] = useState(false); // Error modal state

    const { auction_id } = useParams(); // Get auction_id from URL

    // Fetch auctioneers from API
    useEffect(() => {
        const fetchAuctioneers = async () => {
            try {
                // Fetch all auctioneers
                const auctioneersResponse = await fetch("http://localhost:5001/auctioneer/list");
                const auctioneersData = await auctioneersResponse.json();

                if (auctioneersData.success) {
                    setAuctioneers(auctioneersData.auctioneers); // Store full auctioneer data
                } else {
                    console.error("Failed to fetch auctioneers");
                    setShowErrorModal(true); // Show error modal if API fails
                }

                // Fetch initial auctioneers for the auction (assuming similar API to franchises)
                const initialAuctioneersResponse = await fetch(
                    `http://localhost:5001/auction/auctioneers?auction_id=${auction_id}`
                );
                const initialAuctioneersData = await initialAuctioneersResponse.json();

                if (initialAuctioneersResponse.ok) {
                    // Convert the object to an array of auctioneer names
                    const initialAuctioneersArray = Object.values(initialAuctioneersData).map(
                        (auctioneer) => auctioneer.auctioneer_name
                    );
                    setAllAuctioneers(initialAuctioneersArray); // Set initial auctioneers
                } else {
                    console.error("Failed to fetch initial auctioneers");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setShowErrorModal(true); // Show error modal on network error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchAuctioneers();
    }, [auction_id]); // Fetch data when auction_id changes

    const handleSelection = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !allAuctioneers.includes(selectedValue)) {
            setAllAuctioneers([...allAuctioneers, selectedValue]); // Add new auctioneer to the list
        }
    };

    const handleDelete = (auctioneer) => {
        setAllAuctioneers(allAuctioneers.filter((item) => item !== auctioneer)); // Remove auctioneer from the list
    };

    const handleDeleteAll = () => {
        setAllAuctioneers([]); // Clear all auctioneers
    };

    const handleSave = async () => {
        try {
            // Prepare auctioneersData for the API call
            const auctioneersData = allAuctioneers.map((auctioneerName) => {
                const auctioneer = auctioneers.find((a) => a.auctioneer_name === auctioneerName);
                return {
                    auctioneer_id: auctioneer._id, // Use the auctioneer ID from the fetched data
                };
            });

            // Make the API call
            const response = await fetch("http://localhost:5001/auction/add-auctioneers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("customer_token")}`, // Add bearer token
                },
                body: JSON.stringify({
                    auction_id: auction_id, // Use auction_id from URL
                    auctioneersData,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setShowSuccessModal(true); // Show success modal
            } else {
                setShowErrorModal(true); // Show error modal if API fails
            }
        } catch (error) {
            console.error("Error saving auctioneers:", error);
            setShowErrorModal(true); // Show error modal on network error
        }
    };

    return (
        <div className="flex flex-col min-w-[330px]">
            {/* Auctioneers List */}
            <div className="mt-4 flex flex-col gap-3">
                <div>
                    <h1>Auctioneer Name</h1>
                </div>
                {/* Display all auctioneers */}
                {allAuctioneers.map((auctioneer, index) => (
                    <div key={index} className="flex">
                        <div className="w-[200px] min-w-[200px] max-w-[200px] p-1 px-2 border border-gray-300 rounded bg-transparent overflow-hidden whitespace-nowrap text-ellipsis">
                            {auctioneer}
                        </div>
                        <div
                            className="p-2 rounded text-red-500 text-[20px] cursor-pointer"
                            onClick={() => handleDelete(auctioneer)}
                        >
                            <MdOutlineDelete />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Auctioneer Dropdown */}
            <div className="mt-5">
                <label htmlFor="auctioneer">Add an Auctioneer:</label>
                <select
                    id="auctioneer"
                    className="block rounded px-2 py-1 mt-2 bg-white border border-gray-300 cursor-pointer text-[14px]"
                    onChange={handleSelection}
                    disabled={loading} // Disable dropdown while loading
                >
                    <option value="">Select an Auctioneer</option>
                    {auctioneers.map((auctioneer, index) => (
                        <option key={index} value={auctioneer.auctioneer_name}>
                            {auctioneer.auctioneer_name}
                        </option>
                    ))}
                </select>
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
                    <p>Loading auctioneers...</p>
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