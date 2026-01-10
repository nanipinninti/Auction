import toIndianCurrency from '@/utils/indianCurrencyConvertor';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const Sets = () => {
  const { auction_id } = useParams();
  const [sets, setSets] = useState([]);
  const [expandedSet, setExpandedSet] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/auction-details/remaining-sets?auction_id=${auction_id}`
      );
      const data = await response.json();
      
      if (data.success) {
        // Filter only available sets
        const availableSets = data.sets.filter(set => set.status === 'Available');
        setSets(availableSets);
      } else {
        console.error('Failed to fetch sets');
      }
    } catch (error) {
      console.error('Error fetching sets');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async (setNo) => {
    setLoadingPlayers(true);
    try {
      const response = await fetch(
        `${DOMAIN}/auction-details/players-in-set-info?auction_id=${auction_id}&set_no=${setNo}`
      );
      const data = await response.json();
      
      if (data.success) {
        setPlayers(data.players_info);
        setExpandedSet(setNo);
      } else {
        console.error('Failed to fetch players');
      }
    } catch (error) {
      console.error('Error fetching players');
    } finally {
      setLoadingPlayers(false);
    }
  };

  return (
    <div className="sm:bg-gray-50 w-full rounded-xl overflow-hidden border border-gray-200">
      <div className="sm:bg-white rounded-md sm:shadow-lg pt-4">
        <div className="flex justify-between items-center px-6 py-4 sm:border-b">
          <h1 className="text-[18px] font-medium">Available Sets</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-6 pt-2 sm:p-6">
              {sets.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No available sets
                </div>
              ) : (
                sets.map((set) => (
                  <div
                    key={set.set_no}
                    className="bg-white sm:rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => expandedSet === set.set_no ? setExpandedSet(null) : fetchPlayers(set.set_no)}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-[80px] w-[80px] rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-600">
                              {set.set_no}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-[1px]">
                          <h3 className="text-[15px] font-medium text-gray-800">
                            {set.set_name}
                          </h3>
                          
                          {/* Removed crown icon section */}
                          <div className="flex items-center gap-1 text-gray-600">
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                              </svg>
                            </div>
                            <h2 className="text-sm">
                              Set #{set.set_no}
                            </h2>
                          </div>

                          {/* Players count in an set */}
                          {/* <div className="flex gap-3 items-center">
                            <div className="flex items-center font-medium gap-1">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                  <path d="M16 3.128a4 4 0 0 1 0 7.744"/>
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                  <circle cx="9" cy="7" r="4"/>
                                </svg>
                              </div>
                              <p className="text-sm text-gray-600">
                                Players: {set.player_count || (set.players_count || '0')}
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Expanded Player List Modal */}
            {expandedSet && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                  {/* Header */}
                  <div className="p-3 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {sets.find(s => s.set_no === expandedSet)?.set_name} - Players
                      </h2>
                      <button
                        onClick={() => {
                          setExpandedSet(null);
                          setPlayers([]);
                        }}
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
                  <div className="overflow-y-auto flex-1 px-6 bg-gray-50 ">
                    {loadingPlayers ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : players.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No players in this set
                      </div>
                    ) : (
                      <div className="">
                        {players.map((player, index) => (
                          <div key={index} className="bg-gray-50 p-4 text-sm rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {player.player_name}
                                </h3>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">
                                  Base: {toIndianCurrency(player.base_price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total Players: {players.length}
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

export default Sets;