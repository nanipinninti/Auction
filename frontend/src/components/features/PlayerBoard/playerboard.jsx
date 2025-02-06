import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import toIndianCurrency from "@/utils/indianCurrencyConvertor";
import NextBid from "@/utils/NextBid";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
    customer: "customer",
    auctioneer: "auctioneer",
    franchise: "franchise",
  };

export default function PlayerBoard(props) {
    const [playerDetails, setPlayerDetails] = useState({});
    const [endTime, setEndTime] = useState(30);
    const [isLoading, setIsLoading] = useState(true);
    const { auction_id } = useParams();

    const {playerId,methods,auctionDetails,mode} = props
    const {PauseAuction,SoldPlayer,UnSoldPlayer,RaiseBid} = methods

    const {
        player_name = '',
        base_price = 0,
        age = 0,
        country = '',
        Type = '',
        image_url = ''
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
        stumpings = 0
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
                method: 'GET'
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

    useEffect(()=>{

    },[])
    const { current_bid, current_franchise } = auctionDetails || {};
    const franchise_details = JSON.parse(
        sessionStorage.getItem("franchise_details")
      );
      const franchise_name =
        franchise_details && franchise_details[current_franchise]
          ? franchise_details[current_franchise].franchise_name
          : "#";

    return (
        <>
        {/* Profile & Stats */}
        <div className="container mx-auto px-4">
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="sm:shadow-md sm:rounded py-[30px] w-full max-w-[1400px] p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Left Section - Player Image and Basic Info */}
                        <div className="w-full sm:w-1/2">
                            <div className="flex flex-col items-center">
                                {image_url ? (
                                    <img
                                        src={image_url}
                                        alt={player_name}
                                        className="rounded object-cover w-[250px] h-[300px] mb-4 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-[250px] h-[300px] bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-gray-500">No image available</span>
                                    </div>
                                )}
                                <h1 className="text-2xl font-bold mt-4">{player_name}</h1>
                                <div className="text-sm uppercase text-gray-600 mt-2">
                                    {country} | {Type}
                                </div>
                                <div className="mt-2">
                                    <span className="text-sm">Base Price: ${base_price.toLocaleString()}</span>
                                </div>
                                <div className="mt-1">
                                    <span className="text-sm">Age: {age}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Stats */}
                        <div className="w-full sm:w-1/2">
                            <div className="flex flex-col gap-4">
                                {/* Batting Stats */}
                                <div className="w-full bg-white p-4 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold mb-2">Batting Stats</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Innings</p>
                                            <p className="text-xl font-bold">{matches_played}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Runs</p>
                                            <p className="text-xl font-bold">{runs}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Average</p>
                                            <p className="text-xl font-bold">{avg}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Strike Rate</p>
                                            <p className="text-xl font-bold">{strike_rate}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Fifties</p>
                                            <p className="text-xl font-bold">{fifties}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Stumpings</p>
                                            <p className="text-xl font-bold">{stumpings}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bowling Stats */}
                                <div className="w-full bg-white p-4 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold mb-2">Bowling Stats</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Wickets</p>
                                            <p className="text-xl font-bold">{wickets}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Bowling Average</p>
                                            <p className="text-xl font-bold">{bowling_avg}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase text-gray-600">Three Wicket Hauls</p>
                                            <p className="text-xl font-bold">{three_wicket_haul}</p>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
        <div className="sticky sm:shadow-md flex items-center px-[20px] gap-5 sm:mt-5 py-[15px] rounded">
          <div className="">
            <h1 className="text-xs uppercase">Base Price</h1>
            <h1 className="text-xl">{toIndianCurrency(base_price)}</h1>
          </div>
          <div className="">
            <h1 className="text-xs uppercase">Current Bid</h1>
            <h1 className="text-xl">{toIndianCurrency(current_bid)}</h1>
          </div>
          <div className="">
            <h1 className="text-xs uppercase">Bid By</h1>
            <h1 className="text-xl">{franchise_name}</h1>
          </div>
        </div>

        {/* For Franchises */}
        {mode === modeNames.franchise && (
          <div className="sticky sm:shadow-md flex items-center px-[20px] gap-5 sm:mt-5 py-[15px] rounded">
            <div className="">
              <h1 className="text-xs uppercase">Remaining Purse</h1>
              <h1 className="text-xl">0</h1>
            </div>
            {/* Main */}
            {Cookies.get("franchise_id") !== current_franchise ? (
              <div className="bg-[#615FFF] text-white px-2 rounded-xl text-sm py-1 h-full">
                <button onClick={()=>{RaiseBid(current_bid)}}>
                  Raise Bid
                  <br />
                  {toIndianCurrency(NextBid(current_bid))}
                </button>
              </div>
            ) : (
              <div className="bg-[#787A7A] text-white px-2 rounded-xl text-sm py-1 h-full cursor-not-allowed">
                <button>
                  Your Bid <br />
                  {toIndianCurrency(current_bid)}
                </button>
              </div>
            )}
            <div className="">
              <h1 className="text-xs uppercase">Min Rem Players</h1>
              <h1 className="text-xl">5</h1>
            </div>
          </div>
        )}

        {/* For Auctioneer */}
        {mode === modeNames.auctioneer && (
          <div className="sticky sm:shadow-md flex items-center px-[20px] gap-5 sm:mt-5 py-[15px] rounded">
            <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
              <button onClick={PauseAuction}>Pause</button>
            </div>

            <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
              <button onClick={()=>SoldPlayer(current_franchise,current_bid)}>Sold</button>
            </div>

            <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
              <button onClick={UnSoldPlayer}>Unsold</button>
            </div>
          </div>
        )}
      </div>
        </>
    );
}

