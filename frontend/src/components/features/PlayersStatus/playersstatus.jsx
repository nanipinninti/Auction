import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const PlayerStatus = () => {
  const [tabId, setTabId] = useState('Sold Players');
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unSoldPlayers, setUnSoldPlayers] = useState([]);
  const [upComingPlayers, setUpComingPlayers] = useState([]);

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
      .then((data) => setUpComingPlayers(data.availablePlayers || []));
  }, [auction_id]);

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
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
                      <td className="px-4 py-3 text-sm text-gray-900">{player.sold_price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{player.base_price}</td>
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
                      <td className="px-4 py-3 text-sm text-gray-900">{player.base_price}</td>
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
                      <td className="px-4 py-3 text-sm text-gray-900">{player.base_price}</td>
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