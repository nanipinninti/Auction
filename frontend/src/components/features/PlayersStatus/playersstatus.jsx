import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom"
const DOMAIN = import.meta.env.VITE_DOMAIN;

const PlayerStatus = () => {
  const [tabId, setTabId] = useState('Sold Players');
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unSoldPlayers, setUnSoldPlayers] = useState([]);
  const [upComingPlayers, setUpComingPlayers] = useState([]);

  const {auction_id} = useParams()

  useEffect(() => {
    fetch( `${DOMAIN}/auction-details/sold-players?auction_id=${auction_id}`)
      .then(response => response.json())
      .then(data => setSoldPlayers(data.sold_players || []));

    fetch( `${DOMAIN}/auction-details/un-sold-players?auction_id=${auction_id}`)
      .then(response => response.json())
      .then(data => setUnSoldPlayers(data.un_sold_players || [ ]));

    fetch( `${DOMAIN}/auction-details/next-players?auction_id=${auction_id}`)
      .then(response => response.json())
      .then(data => setUpComingPlayers(data.availablePlayers || []));
  }, []);

  return (
    <div className="bg-white w-screen flex justify-center">
      <div className="sm:w-[50%] w-screen shadow-2xl mt-10 pb-5 mb-5">
        <div className="flex items-center dark:bg-gray-100 dark:text-gray-800 justify-center pt-5">
          {['Sold Players', 'UnSold Players', 'UpComing Players'].map((category) => (
            <button
              key={category}
              style={{
                padding: "4px 20px",
                border: "none",
                borderBottom: tabId === category ? "3px solid #615FFF" : "3px solid gray",
                backgroundColor: "transparent",
                cursor: "pointer",
                outline: "none",
                borderRadius: 0,
                color: tabId === category ? "#615FFF" : "black",
                marginLeft: "3px",
              }}
              onClick={() => setTabId(category)}
            >
              {category.replace(" Players", "")}
            </button>
          ))}
        </div>
        {tabId === "Sold Players" && (
          <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800 w-full sm:w-[70%]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="dark:bg-gray-300 text-[15px]">
                  <tr className="text-left">
                    <th className="p-3">Player Name</th>
                    <th className="p-3">Franchise</th>
                    <th className="p-3">Sold Price</th>
                    <th className="p-3">Base Price</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {soldPlayers.map((player, index) => (
                    <tr key={index} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                      <td className="p-3">{player.player_name}</td>
                      <td className="p-3">
  {JSON.parse(sessionStorage.getItem("franchise_details") || "{}")[player.franchise_id]?.franchise_name}
</td>

                      <td className="p-3">{player.sold_price}</td>
                      <td className="p-3">{player.base_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tabId === "UnSold Players" && (
          <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800 w-[70%]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="dark:bg-gray-300 text-[15px]">
                  <tr className="text-left">
                    <th className="p-3">Player Name</th>
                    <th className="p-3">Base Price</th>
                    
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {unSoldPlayers.map((player, index) => (
                    <tr key={index} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                      <td className="p-3">{player.player_name}</td>
                      <td className="p-3">{player.base_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tabId === "UpComing Players" && (
          <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800 w-[70%]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="dark:bg-gray-300 text-[15px]">
                  <tr className="text-left">
                    <th className="p-3">Player Name</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Set No</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {upComingPlayers.map((player, index) => (
                    <tr key={index} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                      <td className="p-3">{player.player_name}</td>
                      <td className="p-3">{player.base_price}</td>
                      <td className='p-3'>{player.set_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatus;