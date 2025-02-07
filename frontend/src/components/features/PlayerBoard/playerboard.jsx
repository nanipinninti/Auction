import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import toIndianCurrency from "@/utils/indianCurrencyConvertor";
import NextBid from "@/utils/NextBid";
import Timer from "../Timer/timer";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
  customer: "customer",
  auctioneer: "auctioneer",
  franchise: "franchise",
};

export default function PlayerBoard(props) {
  const [playerDetails, setPlayerDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { auction_id } = useParams();

  const { playerId, methods, auctionDetails, mode, endTime, resetTimer } = props;
  const { PauseAuction, SoldPlayer, UnSoldPlayer, RaiseBid } = methods;

  const {
    player_name = "",
    base_price = 0,
    age = 0,
    country = "",
    Type = "",
    image_url = "",
  } = playerDetails;

  const {
    matches_played = 0,
    runs = 0,
    avg = 0,
    strike_rate = 0,
    fifties = 0,
    wickets = 0,
    bowling_avg = 0,
    three_wicket_haul = 0,
    stumpings = 0,
  } = playerDetails.stats || {};

  const fetchPlayerDetails = async () => {
    setIsLoading(true);
    try {
      if (!playerId || playerId === "#") {
        alert("Invalid player ID");
        return;
      }

      const api = `${DOMAIN}/auction-details/player?player_id=${playerId}&auction_id=${auction_id}`;
      const options = {
        method: "GET",
      };

      const response = await fetch(api, options);

      if (response.ok) {
        const data = await response.json();
        setPlayerDetails(data.player_details || {});
      } else {
        alert(`Failed to fetch player details. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching player details:", error);
      alert("Failed to fetch player details. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerId && playerId !== "#") {
      fetchPlayerDetails();
    } else {
      setPlayerDetails({});
    }
  }, [playerId, auction_id]);

  const { current_bid, current_franchise } = auctionDetails || {};
  const franchise_details = JSON.parse(sessionStorage.getItem("franchise_details"));
  const franchise_name =
    franchise_details && franchise_details[current_franchise]
      ? franchise_details[current_franchise].franchise_name
      : "#";

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Timer Section */}
      <div className="mb-8">
        <Timer endTime={endTime} />
      </div>

      {/* Profile & Stats Section */}
      <div className="container mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Left Section - Player Image and Basic Info */}
              <div className="w-full sm:w-1/3 flex flex-col items-center">
                {image_url ? (
                  <img
                    src={image_url}
                    alt={player_name}
                    className="rounded-lg object-cover w-[250px] h-[300px] mb-6 shadow-lg"
                  />
                ) : (
                  <div className="w-[250px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-800">{player_name}</h1>
                <div className="text-sm uppercase text-gray-600 mt-2">
                  {country} | {Type}
                </div>
                <div className="mt-2 text-gray-700">
                  <span className="text-sm">Base Price: ${base_price.toLocaleString()}</span>
                </div>
                <div className="mt-1 text-gray-700">
                  <span className="text-sm">Age: {age}</span>
                </div>
              </div>

              {/* Right Section - Stats */}
              <div className="w-full sm:w-2/3">
                <div className="flex flex-col gap-6">
                  {/* Batting Stats */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Batting Stats</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <StatCard label="Innings" value={matches_played} />
                      <StatCard label="Runs" value={runs} />
                      <StatCard label="Average" value={avg} />
                      <StatCard label="Strike Rate" value={strike_rate} />
                      <StatCard label="Fifties" value={fifties} />
                      <StatCard label="Stumpings" value={stumpings} />
                    </div>
                  </div>

                  {/* Bowling Stats */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Bowling Stats</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <StatCard label="Wickets" value={wickets} />
                      <StatCard label="Bowling Average" value={bowling_avg} />
                      <StatCard label="3-Wicket Hauls" value={three_wicket_haul} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bid Section */}
      <div className="sticky bottom-0 bg-white shadow-lg mt-8 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Base Price, Current Bid, Bid By */}
            <div className="flex gap-6">
              <StatCard label="Base Price" value={toIndianCurrency(base_price)} />
              <StatCard label="Current Bid" value={toIndianCurrency(current_bid)} />
              <StatCard label="Bid By" value={franchise_name} />
            </div>

            {/* Franchise Actions */}
            {mode === modeNames.franchise && (
              <div className="flex gap-4 items-center">
                <StatCard label="Remaining Purse" value="0" />
                {Cookies.get("franchise_id") !== current_franchise ? (
                  <button
                    onClick={() => RaiseBid(current_bid)}
                    className="bg-[#615FFF] text-white px-6 py-2 rounded-lg hover:bg-[#4a4ac7] transition-all"
                  >
                    Raise Bid <br />
                    {toIndianCurrency(NextBid(current_bid))}
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-[#787A7A] text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  >
                    Your Bid <br />
                    {toIndianCurrency(current_bid)}
                  </button>
                )}
                <StatCard label="Min Rem Players" value="5" />
              </div>
            )}

            {/* Auctioneer Actions */}
            {mode === modeNames.auctioneer && (
              <div className="flex gap-4">
                <button
                  onClick={PauseAuction}
                  className="bg-[#615FFF] text-white px-6 py-2 rounded-lg hover:bg-[#4a4ac7] transition-all"
                >
                  Pause
                </button>
                <button
                  onClick={() => SoldPlayer(current_franchise, current_bid)}
                  className="bg-[#615FFF] text-white px-6 py-2 rounded-lg hover:bg-[#4a4ac7] transition-all"
                >
                  Sold
                </button>
                <button
                  onClick={UnSoldPlayer}
                  className="bg-[#615FFF] text-white px-6 py-2 rounded-lg hover:bg-[#4a4ac7] transition-all"
                >
                  Unsold
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component
const StatCard = ({ label, value }) => (
  <div className="text-center">
    <p className="text-sm uppercase text-gray-600">{label}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);