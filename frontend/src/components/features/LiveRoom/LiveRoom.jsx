import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

// utils
import ModeCheck from "@/utils/modecheck";
import NextBid from "@/utils/NextBid";
import { alertTitleClasses } from "@mui/material";
import toIndianCurrency from "@/utils/indianCurrencyConvertor";

import socket from "../../../socket/socket";
import PlayerBoard from "../PlayerBoard/playerboard";
import LoadingComponent from "@/components/common/Loader/loader";
import FailureComponent from "@/components/common/Failure/failure";
import AuctionPause from "../AuctionPause/auctionpause";
import SuccessModal from "@/components/popup/Login/success";

import { toast } from "react-toastify";

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
  completed : "completed"
};

export default function LiveRoom() {
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(statusNames.pause);
  const [playerId, setPlayerId] = useState("");
  const [mode, setMode] = useState("customer");
  const [showPopUp,setShowPopUp] = useState(false)
  const [popUpMessage,setPopUpMessage] = useState("")
  const [endTime,setEndTime] = useState(Math.floor(Date.now() / 1000) + 30)

  const { auction_id } = useParams();

  // Intailly 

  const franchise_details = JSON.parse(
    sessionStorage.getItem("franchise_details")
  );

  useEffect(() => {
    const CheckMode = async ()=>{
      const flag = await ModeCheck(auction_id)
      setMode(modeNames[flag])
    }
    
    CheckMode();
    fetchAuctionDetails();
    socket.connect();
    socket.emit("join_room", { auction_id });

    socket.on("joined_room", (message) => {
      toast.success(message);
    });

    socket.on("auction-stopped",()=>{
      toast.error("Auction is stopped..")
    })
    socket.on("refresh", () => {
      fetchAuctionDetails();
    });

    socket.on("player-sold-unsold", (data) => {
      if (!data.sold){        
        setPopUpMessage(data.message)
      }else{
        const franchise_name = franchise_details && franchise_details[data.franchise_id]
        ? franchise_details[data.franchise_id].franchise_name
        : "#";
        setPopUpMessage(data.message + franchise_name)
      }
      setShowPopUp(true)
    });

    socket.on("end_time",(end_time)=>{
      setEndTime(end_time)
    })


    return () => {
      socket.off("joined_room");
      socket.disconnect();
    };
  }, [auction_id]);


  const fetchAuctionDetails = async () => {
    const api = `${DOMAIN}/auction-details/status?auction_id=${auction_id}`;
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
        toast.error("Failted to Fetch");
      }
    } catch (error) {
      toast.error("Failted to fetch");
    }
  };

  // auction actions for auctioneer
  const SendPlayer = async () => {
    const api =  `${DOMAIN}/auction-actions/send-player`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json()
        if (data.success){
          fetchAuctionDetails();
        }else{
          PickSet()
        }        
        socket.emit("refresh");
        socket.emit("reset",auction_id)
      } else {
        toast.error("Failed to send the player");
      }
    } catch (error) {
      toast.error("Servor error");
    }
  };



  const PauseAuction = async () => {
    const api = `${DOMAIN}/auction-actions/pause-auction`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        socket.emit("close-timer")
        socket.emit("refresh");
      } else {
        toast.error("failed to pause the auction , incorrect auction id");
      }
    } catch (error) {
      toast.error("Failed to pause the auction");
    }
  };

  // Need to rectify this
  const SoldPlayer = async (current_franchise,current_bid) => {
    const api = `${DOMAIN}/auction-actions/sold-player`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
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
        toast.success(
          `Player sucesfully sold!!... `
        );
        socket.emit("refresh");
        socket.emit("reset",auction_id)
      } else {
        toast.error("Failed to sold the Player");
      }
    } catch (error) {
      toast.error("Failed to sold the Player, Internal servor error");
    }
  };

  const UnSoldPlayer = async () => {
    const api = `${DOMAIN}/auction-actions/un-sold-player`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("auctioneer_token")}`,
      },
      body: JSON.stringify({
        auction_id,
        player_id: playerId,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        fetchAuctionDetails();
        SendPlayer();
        socket.emit("refresh");
        socket.emit("reset",auction_id)
      } else {
        toast.error("Failed to Unsold the Players");
      }
    } catch (error) {
      toast.error("Failed to Un Sold the Player, Internal servor error");
    }
  };
  // auction actions for franchise
  const RaiseBid = async (current_bid) => {
    const api = `${DOMAIN}/auction-actions/raise-bid`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
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
        socket.emit("reset",auction_id)
        socket.emit("refresh");
      } else {
        toast.error("Failed to Raise the Bid, Try again");
        fetchAuctionDetails();
      }
    } catch (error) {
      toast.error("Servor Error");
    }
  };

  const PickSet = async (set_no = -1) => {
    const api =  `${DOMAIN}/auction-actions/pick-set`;
    const options = {
      method: "POST",
      credentials: "include", 
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
        const data = await response.json()
        if (data.success){
          if (set_no===-1){
            SendPlayer()
          }
          toast.error("Succesfully set the Set");
        }
        else if(data.code === "end-auction") {
          return EndAuction()
        }
      } else {
        toast.error("Failed to Pick the set, Try again");
      }
    } catch (error) {
      toast.error("Servor Error");
    }
  };

  const EndAuction = async () => {
    const api =  `${DOMAIN}/auction-actions/end-auction`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        toast.error("Auction is successfully completed");   
        setCurrentStatus(statusNames.completed);
     
        fetchAuctionDetails();      
        socket.emit("refresh");
      } else {
        toast.error("Failed to end the Auction!");
      }
    } catch (error) {
      toast.error("Internal Servor Error to end the auction");
    }
  };


  const BeginAuction = ()=>{
    SendPlayer();
    socket.emit("start-timer",auction_id)
    socket.emit("refresh");
    fetchAuctionDetails();
  }

  const methods = {PauseAuction,SoldPlayer,UnSoldPlayer,RaiseBid}
  return(
    <div className="">
      {
        (currentStatus === statusNames.loading )&&
        <div className="h-[300px]">
          <LoadingComponent />
        </div>
      }

      {
      (currentStatus === statusNames.failure )&&
        <div className="">
          <FailureComponent retryAction={fetchAuctionDetails}/>
        </div>
      }

    {
      (currentStatus === statusNames.pause)&&
        <div>
          <AuctionPause mode={mode} PickSet={PickSet} BeginAuction={BeginAuction}/>
        </div>
    }

    {
      (currentStatus === statusNames.ongoing)&&
        <div>
          <PlayerBoard playerId={playerId} methods={methods} auctionDetails = {auctionDetails} mode={mode} endTime={endTime}
          
         />

          {/* Popups */}
          <SuccessModal isOpen={showPopUp} onClose={()=>{setShowPopUp(false)}} msg={popUpMessage}/>
        </div>
    }

   {
      (currentStatus === statusNames.completed)&&
        <div>
          Auction is sucessfully completed! 
        </div>
    }

    </div>
  )
}
