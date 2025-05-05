import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import toIndianCurrency from "@/utils/indianCurrencyConvertor";
import NextBid from "@/utils/NextBid";
import Timer from "../Timer/timer";
import { toast } from "react-toastify";
import LoadingComponent from "@/components/common/Loader/loader";
const DOMAIN = import.meta.env.VITE_DOMAIN;
import { IoPencil } from "react-icons/io5";

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
  const { PauseAuction, SoldPlayer, UnSoldPlayer, RaiseBid,RaiseBidByAuctioneer } = methods;

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
        toast.error("Invalid player ID");
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
        toast.error(`Failed to fetch player details. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching player details:", error);
      toast.error("Failed to fetch player details. Please check your network connection.");
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

  const franchises = JSON.parse(sessionStorage.getItem("franchise_details" )) || {};
  return (
    <div className="bg-gray-50 min-h-screen sm:p-6">
      {/* Profile & Stats Section */}
      <div className="container mx-auto min-h-[500px]">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className="sm:bg-white rounded-lg sm:shadow-md sm:p-6">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Left Section - Player Image and Basic Info */}
              <div className="w-full sm:w-1/3 flex flex-col items-center">
                {image_url ? (
                  <img
                    src={image_url}
                    alt={player_name}
                    className="rounded-lg object-cover w-[250px] h-[330px] mb-6 shadow-lg"
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
                  <span className="text-sm">Base Price: {toIndianCurrency(base_price)}</span>
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
                    <h2 className="text-[18px]  mb-4">Batting Stats</h2>
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
                    <h2 className="text-[18px]  mb-4">Bowling Stats</h2>
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
      <div className="sticky bottom-0 bg-white rounded-md shadow-lg mt-8 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-around items-center">
            {/* Base Price, Current Bid, Bid By */}
            <div className="flex gap-6">
              <StatCard label="Base Price" value={toIndianCurrency(base_price)} />
              <StatCard label="Current Bid" value={toIndianCurrency(current_bid)} />
              <StatCard label="Bid By" value={franchise_name} />
            </div>

            {/* Timer Section */}
            <div>
                  <Timer endTime={endTime} />
            </div>

            {/* Franchise Actions */}
            {mode === modeNames.franchise && (
              <div className="flex gap-4 items-center">
                <StatCard label="Purse Left" value="0" />
                {Cookies.get("franchise_id") !== current_franchise ? (
                  <button
                    onClick={() => RaiseBid(current_bid)}
                    className="bg-[#615FFF] text-white px-6 py-2 rounded-lg hover:bg-[#4a4ac7] transition-all"
                  >
                    <h1 className="text-[10px] uppercase">Raise Bid</h1>
                    {toIndianCurrency(NextBid(current_bid))}
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-[#787A7A] text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  >
                    <h1 className="text-[10px] uppercase">Your Bid</h1>
                    {toIndianCurrency(current_bid)}
                  </button>
                )}
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


    {/* Auctioneer options for offline bidding*/}
    {mode === modeNames.auctioneer && (
      <ManualBidding franchises={franchises} 
        current_bid = {current_bid}
        RaiseBidByAuctioneer={(franchise_id,present_bid = NextBid(current_bid))=>{RaiseBidByAuctioneer(franchise_id,present_bid)}} />
      )
    }      

    </div>
  );
}

// Reusable StatCard Component
const StatCard = ({ label, value }) => (
  <div className="text-center">
    <p className="text-[12px] uppercase text-gray-600">{label}</p>
    <p className="text-[15px] font-bold text-gray-800">{value}</p>
  </div>
);



const ManualBidding = ({ franchises, RaiseBidByAuctioneer, current_bid }) => {
  const [activeFranchise, setActiveFranchise] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [customBid, setCustomBid] = useState('');
  const [nextBid, setNextBid] = useState(NextBid(current_bid));

  // Update nextBid when current_bid prop changes
  useEffect(() => {
    setNextBid(NextBid(current_bid));
  }, [current_bid]);

  const handleClick = (id) => {
    setActiveFranchise(id);
    RaiseBidByAuctioneer(id, nextBid);
    setTimeout(() => setActiveFranchise(null), 200);
  };

  const handlePencilClick = () => {
    // Set initial value to current bid in lakhs when opening modal
    setCustomBid((nextBid / 100000).toString());
    setShowBidModal(true);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (customBid && !isNaN(customBid)) {
      const bidInLakhs = parseInt(customBid);
      if (bidInLakhs > 0) {
        const bidAmount = bidInLakhs * 100000; // Convert to actual amount
        setNextBid(bidAmount);
      }
    }
    setShowBidModal(false);
  };

  return (
    <div className="bg-white rounded-md shadow-lg mt-8 py-4">
      <div className="w-full flex justify-between px-6">
        <h1 className="text-[20px] font-normal mb-4">Manual Bidding</h1>

        <div 
          className="flex justify-between items-bottom gap-2 cursor-pointer"
          onClick={handlePencilClick}
        >
          <h1 className="text-[13px] font-normal mb-4">Next Bid: {toIndianCurrency(nextBid)}</h1>
          <div className="text-[12px]">
            <IoPencil />
          </div>
        </div>
      </div>

      {/* Franchise Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
        {Object.entries(franchises).map(([id, franchise]) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`flex flex-col items-center focus:outline-none transition-all duration-200 ${
              activeFranchise === id ? 'transform scale-95' : 'hover:scale-105'
            }`}
          >
            <div className="relative w-full aspect-square max-w-[150px]">
              <img
                src={franchise.franchise_url || '#'}
                alt={franchise.franchise_name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200';
                }}
              />
              {activeFranchise === id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 rounded-lg transition-all duration-200"></div>
              )}
            </div>
            <h3 className="mt-2 text-md font-medium text-gray-800">
              {franchise.franchise_name}
            </h3>
          </button>
        ))}
      </div>

      {/* Bid Edit Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Set Next Bid Amount</h2>
            <form onSubmit={handleBidSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Amount (in Lakhs)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount in lakhs"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current: {nextBid / 100000} Lakhs ({toIndianCurrency(nextBid)})
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
                >
                  Set Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};