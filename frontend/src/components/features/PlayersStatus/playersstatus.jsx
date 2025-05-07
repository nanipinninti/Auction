import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toIndianCurrency from "@/utils/indianCurrencyConvertor";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const PlayerStatus = () => {
  const [tabId, setTabId] = useState('Sold Players');
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [unSoldPlayers, setUnSoldPlayers] = useState([]);
  const [upComingPlayers, setUpComingPlayers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { auction_id } = useParams();

  useEffect(() => {
    fetch(`${DOMAIN}/auction-details/sold-players?auction_id=${auction_id}`)
      .then((response) => response.json())
      .then((data) => setSoldPlayers(data.sold_players || []));

    fetch(`${DOMAIN}/auction-details/un-sold-players?auction_id=${auction_id}`)
      .then((response) => response.json())
      .then((data) => setUnSoldPlayers(data.un_sold_players || []));

    fetch(`${DOMAIN}/auction-details/next-players?auction_id=${auction_id}`)
      .then((response) => response.json())
      .then((data) => setUpComingPlayers(data.availablePlayers || []))
      .finally(() => setIsRefreshing(false));
  }, [auction_id, refresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefresh(!refresh);
  };

  return (
    <div className="bg-gray-50 min-h-[300px] flex justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with title and refresh button */}
        <div className="flex justify-between items-center bg-gray-100 p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Player Status</h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center bg-gray-100 p-2">
          {['Sold Players', 'UnSold Players', 'UpComing Players'].map((category) => (
            <button
              key={category}
              className={`px-6 py-2 text-sm font-medium ${
                tabId === category
                  ? 'text-white bg-purple-600'
                  : 'text-gray-600 hover:bg-gray-200'
              } rounded-md transition-all duration-300`}
              onClick={() => setTabId(category)}
            >
              {category.replace(' Players', '')}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="p-4">
          {tabId === 'Sold Players' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Franchise
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {soldPlayers.map((player, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{player.player_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {JSON.parse(sessionStorage.getItem('franchise_details') || '{}')[
                          player.franchise_id
                        ]?.franchise_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{toIndianCurrency(player.sold_price)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{toIndianCurrency(player.base_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabId === 'UnSold Players' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unSoldPlayers.map((player, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{player.player_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{toIndianCurrency(player.base_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabId === 'UpComing Players' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Set No
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upComingPlayers.map((player, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{player.player_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{toIndianCurrency(player.base_price)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{player.set_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;