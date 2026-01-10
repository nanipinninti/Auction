import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import toIndianCurrency from "@/utils/indianCurrencyConvertor";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const FranchiseStatus = () => {
  const { auction_id } = useParams();
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFranchiseStatus();
  }, []);



  useEffect(() => {
    if (selectedFranchise) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 200);
    }
  }, [selectedFranchise]);

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
    await new Promise(resolve => setTimeout(resolve, 500));
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
        console.log("Failed to fetch franchise details.");
      }
    } catch (err) {
      console.error("Error fetching franchise status:", err);
      console.log("Server error.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFranchiseStatus();
  };


  return (
    <div className="sm:bg-gray-50 w-full rounded-xl overflow-hidden border border-gray-200">
      <div className="sm:bg-white rounded-md sm:shadow-lg pt-4">
        <div className="flex  justify-between items-center px-6 py-4 sm:border-b  ">
          <h1 className="text-[18px] font-medium">Franchise Status</h1>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-[12px] font-medium transition-all duration-200 min-w-[80px] justify-center"
          >
            {refreshing ? (
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Refreshing</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </div>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-6 pt-2 sm:p-6">
              {franchises.map((franchise) => (
                <div
                  key={franchise.id}
                  onClick={() => setSelectedFranchise(franchise)}
                  className="bg-white sm:rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
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

                      <div className="flex flex-col gap-[1px]">
                        <h3 className="text-[15px] font-medium text-gray-800">
                          {franchise.franchise_name}
                        </h3>            

                        <div className="flex items-center gap-1 text-yellow-700">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown-icon lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
                              </div>
                              <h2 className="text-sm ">
                                {franchise.owner_name}
                              </h2>
                        </div>

                        <div className="flex gap-3 items-center">
                            <div className="flex items-center font-medium gap-1">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
                              </div>
                              <p className="text-sm text-gray-600">
                                {franchise.players_bought}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-green-600">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                              </div>
                              <p className="text-sm">
                                {toIndianCurrency(franchise.remaining_purse)}
                              </p>
                            </div>
                        </div>
  
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {selectedFranchise && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-gray-200">
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

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 p-6">
                      {selectedFranchise.players_bought_list.length > 0 ? (
                        <div className="space-y-4">
                          {selectedFranchise.players_bought_list.map((player, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
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
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          This franchise hasn&apos;t bought any players yet.
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>



          </>
        )}
      </div>
    </div>
  );
};

export default FranchiseStatus;