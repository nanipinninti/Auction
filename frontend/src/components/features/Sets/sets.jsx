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
        toast.error('Failed to fetch sets');
      }
    } catch (error) {
      toast.error('Error fetching sets');
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
        toast.error('Failed to fetch players');
      }
    } catch (error) {
      toast.error('Error fetching players');
    } finally {
      setLoadingPlayers(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <div className="bg-gray-50 w-full  sm:p-6">
      <div className="bg-white rounded-md shadow-lg py-4">
        <h1 className="text-2xl font-bold px-6 py-4">Available Sets</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="px-6 pb-4">
            {sets.length === 0 ? (
              <p className="text-gray-500">No available sets</p>
            ) : (
              <div className="space-y-2">
                {sets.map((set) => (
                  <div key={set.set_no} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => expandedSet === set.set_no ? setExpandedSet(null) : fetchPlayers(set.set_no)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800">{set.set_name}</h3>
                        <p className="text-sm text-gray-500">Set #{set.set_no}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          expandedSet === set.set_no ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedSet === set.set_no && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {loadingPlayers ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        ) : players.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No players in this set</p>
                        ) : (
                          <div className="space-y-3">
                            {players.map((player, index) => (
                              <div key={index} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                <span className="font-medium">{player.player_name}</span>
                                <span className="text-sm text-gray-600">
                                  {toIndianCurrency(player.base_price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sets;