import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
// utils
import ModeCheck from "@/utils/modecheck";
import NextBid from "@/utils/NextBid";
import { alertTitleClasses } from "@mui/material";
import toIndianCurrency from "@/utils/indianCurrencyConvertor";

import socket from "../../../socket/socket";
import PlayerStatus from "../PlayersStatus/playersstatus";

const modeNames = {
  customer: "customer",
  auctioneer: "auctioneer",
  franchise: "franchise",
};

const statusNames = {
  loading: "loading",
  failure: "failure",
  ongoing: "ongoing",
  pause: "pause",
};

export default function LiveRoom() {
  const [playerDetails, setPlayerDetails] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(statusNames.loading);
  const [playerId, setPlayerId] = useState("");
  const [mode, setMode] = useState(ModeCheck());
  const [setsInfo, setSetsInfo] = useState([]);
  const [pickSet, setPickSet] = useState(1);

  const { auction_id } = useParams();

  // For sockets
  useEffect(() => {
    fetchAuctionDetails();
    socket.connect();

    // Emit the "join_room" event with the auction ID
    socket.emit("join_room", { auction_id });

    // Listen for confirmation of joining the room
    socket.on("joined_room", (message) => {
      console.log(message);
    });
    socket.on("refresh", () => {
      fetchAuctionDetails();
    });
    return () => {
      socket.off("joined_room");
      socket.disconnect();
    };
  }, [auction_id]);

  useEffect(() => {
    fetchSetsInfo();
  }, []);

  const fetchSetsInfo = async () => {
    const api = `http://localhost:5001/auction-details/remaining-sets?auction_id=${auction_id}`;
    const options = {
      method: "GET",
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json();
        setSetsInfo([...data.sets]);
      }
    } catch {
      alert("Internal servor error");
    }
  };
  useEffect(() => {
    if (playerId) {
      fetchPlayerDetails();
    }
  }, [playerId]);

  const fetchAuctionDetails = async () => {
    const api = `http://localhost:5001/auction-details/status?auction_id=${auction_id}`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data.current_status);
        setAuctionDetails(data.auction_details);
        setPlayerId(data.auction_details.current_player);
        sessionStorage.setItem("bid_ratio", JSON.stringify(data.bid_ratio));
      } else {
        alert("Failted to Fetch");
      }
    } catch (error) {
      alert("Failted to fetch");
    }
  };

  const fetchPlayerDetails = async () => {
    const api = `http://localhost:5001/auction-details/player?player_id=${playerId}&auction_id=${auction_id}`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json();
        setPlayerDetails(data.player_details);
      } else {
        alert("Failted to Fetch");
      }
    } catch (error) {
      alert("Failted to fetch");
    }
  };

  // auction actions for auctioneer
  const SendPlayer = async () => {
    const api = "http://localhost:5001/auction-actions/send-player";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        socket.emit("refresh");
      } else {
        alert("Failed to send the player");
      }
    } catch (error) {
      alert("Servor error");
    }
  };

  const StartAuction = async () => {
    const api = "http://localhost:5001/auction-actions/start-auction";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        SendPlayer();
        socket.emit("refresh");
        fetchAuctionDetails();
      } else {
        alert("failed to start the auction , incorrect auction id");
      }
    } catch (error) {
      alert("Failed to start the auction");
    }
  };

  const PauseAuction = async () => {
    const api = "http://localhost:5001/auction-actions/pause-auction";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        socket.emit("refresh");
      } else {
        alert("failed to pause the auction , incorrect auction id");
      }
    } catch (error) {
      alert("Failed to pause the auction");
    }
  };

  const SoldPlayer = async () => {
    const api = "http://localhost:5001/auction-actions/sold-player";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
        franchise_id: current_franchise,
        sold_price: current_bid,
        player_id: playerId,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        SendPlayer();
        alert(
          `Player  ${player_name} Sold to ${franchise_name} at ${toIndianCurrency(
            current_bid
          )}`
        );
        socket.emit("refresh");
      } else {
        alert("Failed to sold the Player");
      }
    } catch (error) {
      alert("Failed to sold the Player, Internal servor error");
    }
  };
  // auction actions for franchise
  const RaiseBid = async () => {
    const api = "http://localhost:5001/auction-actions/raise-bid";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("franchise_token")}`,
      },
      body: JSON.stringify({
        auction_id,
        amount: NextBid(current_bid),
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        socket.emit("refresh");
      } else {
        alert("Failed to Raise the Bid, Try again");
        fetchAuctionDetails();
      }
    } catch (error) {
      alert("Servor Error");
    }
  };

  const PickSet = async () => {
    const set_no = pickSet;
    const api = "http://localhost:5001/auction-actions/pick-set";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
        set_no,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        alert("Succesfully set the Set");
      } else {
        alert("Failed to Pick the set, Try again");
      }
    } catch (error) {
      alert("Servor Error");
    }
  };

  const { player_name, base_price, age, country, Type, image_url } =
    playerDetails || {};
  const {
    matches_played,
    runs,
    avg,
    strike_rate,
    fifties,
    wickets,
    bowling_avg,
    three_wicket_haul,
    stumpings,
  } = playerDetails ? playerDetails.stats : {};

  const { current_bid, current_franchise } = auctionDetails || {};

  if (currentStatus === statusNames.pause) {
    return (
      <>
        {mode === modeNames.auctioneer ? (
          <div className="flex flex-col items-center gap-4">
            {/* Profile and stats */}
            <div className="px-4 rounded-xl text-sm py-3">
              <h1>Pick the Set</h1>
              <select
                className="bg-transparent text-black border rounded w-[200px] p-2 mt-2"
                id="current-set"
                onChange={(e) => setPickSet(Number(e.target.value))} // Handle selection change
              >
                {setsInfo
                  .filter((set) => set.status === "Available") // Filter available sets
                  .map((set) => (
                    <option key={set.set_no} value={set.set_no}>
                      {set.set_name} {/* Display set name */}
                    </option>
                  ))}
              </select>
              <button
                className="block bg-green-400 rounded text-white p-2 py-1 mt-2"
                onClick={() => {
                  PickSet();
                }}
              >
                Save
              </button>
            </div>
            <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
              <button onClick={StartAuction}>Start the auction</button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <h1>Auction Yet to be Start! Please Wait !</h1>
          </div>
        )}
      </>
    );
  }
  const franchise_details = JSON.parse(
    sessionStorage.getItem("franchise_details")
  );
  const franchise_name =
    franchise_details && franchise_details[current_franchise]
      ? franchise_details[current_franchise].franchise_name
      : "#";

  return (
    <div className="flex flex-col items-center">
      {/* Profile and stats */}
      <div className="sm:shadow-md sm:rounded py-[30px] w-full max-w-[1400px] p-4">
        <div className="flex flex-col sm:flex-row">
          {/* Left */}
          <div className="flex flex-col items-center w-full sm:w-1/2">
            <div>
              <img
                src={image_url}
                alt={player_name}
                className="rounded object-cover w-[250px] h-[300px]"
              />
            </div>
            <h1 className="text-xs uppercase mt-5">Name of the Player</h1>
            <h1 className="text-2xl"> {player_name} </h1>
            <h1 className="text-xs uppercase">
              {country} {Type}
            </h1>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-1/2 gap-[30px]">
            <div className="w-[300px] flex flex-col gap-3">
              <h1 className="text-xl">Batting Stats</h1>
              <div className="flex justify-between">
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Innings</h1>
                  <h1 className="text-xl">{matches_played}</h1>
                </div>

                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Runs</h1>
                  <h1 className="text-xl">{runs}</h1>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Average</h1>
                  <h1 className="text-xl">{avg}</h1>
                </div>

                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Strike Rate</h1>
                  <h1 className="text-xl">{strike_rate}</h1>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Fifties</h1>
                  <h1 className="text-xl">{fifties}</h1>
                </div>
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Stumpings</h1>
                  <h1 className="text-xl">{stumpings}</h1>
                </div>
              </div>
            </div>

            <div className="w-[300px] flex flex-col gap-3">
              <h1 className="text-xl">Bowling Stats</h1>
              <div className="flex justify-between">
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Wickets</h1>
                  <h1 className="text-xl">{wickets}</h1>
                </div>

                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Average</h1>
                  <h1 className="text-xl">{bowling_avg}</h1>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="w-[100px]">
                  <h1 className="text-xs uppercase">Three Wicket Haul</h1>
                  <h1 className="text-xl">{three_wicket_haul}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
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
                <button onClick={RaiseBid}>
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
              <button onClick={SoldPlayer}>Sold</button>
            </div>

            <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
              <button>Unsold</button>
            </div>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div>
          <PlayerStatus />
      </div>
    </div>
  );
}
