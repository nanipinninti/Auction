import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

import toIndianCurrency from "@/utils/indianCurrencyConvertor";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const FranchiseStatus = () => {
  const { auction_id } = useParams();
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFranchiseData();
    });
    return () => clearTimeout(timer);
  }, []);

  const loadFranchiseData = () => {
    const statusData = JSON.parse(sessionStorage.getItem("franchise_status") || "{}");
    const detailsData = JSON.parse(sessionStorage.getItem("franchise_details") || "{}");

    if (Object.keys(statusData).length > 0 && Object.keys(detailsData).length > 0) {
      combineData(statusData, detailsData);
      setLoading(false);
    } else {
      fetchFranchiseStatus();
    }
  };

  const combineData = (statusData, detailsData) => {
    const combined = Object.keys(detailsData || {}).map((id) => ({
      id,
      ...detailsData[id],
      ...(statusData?.[id] || {
        remaining_purse: 0,
        players_bought: 0,
        players_bought_list: [],
      }),
    }));
    setFranchises(combined);
  };

  const fetchFranchiseStatus = async () => {
    try {
      const api = `${DOMAIN}/auction-details/franchise-status?auction_id=${auction_id}`;
      const response = await fetch(api);

      if (response.ok) {
        const data = await response.json();
        const statusData = data.franchise_status || {};
        const detailsData = JSON.parse(sessionStorage.getItem("franchise_details") || "{}");

        // Store data in sessionStorage
        sessionStorage.setItem("franchise_status", JSON.stringify(statusData));
        if (!sessionStorage.getItem("franchise_details")) {
          sessionStorage.setItem("franchise_details", JSON.stringify(detailsData));
        }

        combineData(statusData, detailsData);
      } else {
        toast.error("Failed to fetch franchise details.");
      }
    } catch (err) {
      console.error("Error fetching franchise status:", err);
      toast.error("Server error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFranchiseStatus();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };

  return (
    <div className="bg-gray-50 w-full sm:p-6">
      <div className="bg-white rounded-md shadow-lg py-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h1 className="text-[18px] font-semibold">Franchise Status</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {refreshing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
              {franchises.map((franchise) => (
                <div
                  key={franchise.id}
                  onClick={() => setSelectedFranchise(franchise)}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-[80px] w-[80px] rounded-full object-cover"
                          src={
                            franchise.franchise_url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={franchise.franchise_name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {franchise.franchise_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Players: {franchise.players_bought}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          Purse: {toIndianCurrency(franchise.remaining_purse)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedFranchise && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedFranchise.franchise_name} - Players Bought
                      </h2>
                      <button
                        onClick={() => setSelectedFranchise(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-6">
                    {selectedFranchise.players_bought_list.length > 0 ? (
                      <div className="space-y-4">
                        {selectedFranchise.players_bought_list.map(
                          (player, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    {player.player_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Set: {player.set_no}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm">
                                    Base: {toIndianCurrency(player.base_price)}
                                  </p>
                                  <p className="font-medium text-green-600">
                                    Sold: {toIndianCurrency(player.sold_price)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        This franchise hasn't bought any players yet.
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total Players: {selectedFranchise.players_bought}
                      </p>
                      <p className="font-medium">
                        Remaining Purse:{" "}
                        {toIndianCurrency(selectedFranchise.remaining_purse)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FranchiseStatus;