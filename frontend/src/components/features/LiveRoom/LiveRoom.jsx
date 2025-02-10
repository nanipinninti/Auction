import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

// utils
import ModeCheck from "@/utils/modecheck";
import NextBid from "@/utils/NextBid";
import toIndianCurrency from "@/utils/indianCurrencyConvertor";

import socket from "../../../socket/socket";
import PlayerBoard from "../PlayerBoard/playerboard";
import LoadingComponent from "@/components/common/Loader/loader";
import FailureComponent from "@/components/common/Failure/failure";
import AuctionPause from "../AuctionPause/auctionpause";
import SuccessModal from "@/components/popup/Notification/success";
import Swal from "sweetalert2";
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
  upcoming: "upcoming",
  pause: "pause",
  completed : "completed"
};

export default function LiveRoom() {
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [auctionName,setAuctionName] = useState("")
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
      console.log(message);
    });

    socket.on("auction-completed",()=>{
      AuctionCompletion()
    })
    socket.on("refresh", () => {
      fetchAuctionDetails();
    });

    socket.on("player-sold-unsold", (data) => {
      if (!data.sold){        
        toast.success(data.message)
      }else{
        const franchise_name = franchise_details && franchise_details[data.franchise_id]
        ? franchise_details[data.franchise_id].franchise_name
        : "#";

        if (data.franchise_id === Cookies.get("franchise_id")){        
            PlayerBuySucess(data.message + franchise_name)
        }else{
          toast.success(data.message + franchise_name)
        }
      }
      setShowPopUp(true)
    });

    socket.on("pick-set",(data)=>{
        toast.success("Set has been changed")
    })
    socket.on("end_time",(end_time)=>{
      setEndTime(end_time)
    })


    return () => {
      socket.off("joined_room");
      socket.disconnect();
    };
  }, [auction_id]);

  // swal poups
const PlayerBuySucess = (msg)=>{
      Swal.fire({
        title: "Bid Success",
        html: `
          <h1>${msg}</h1>
        `,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#2563eb",
  });
}

const AuctionCompletion = (msg)=>{
  Swal.fire({
    title: "Auction Completed",
    html: `
      <h1>Successfully auction is completed.</h1>
    `,
    icon: "success",
    confirmButtonText: "Okay",
    confirmButtonColor: "#2563eb",
});
}


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
        setAuctionName(data.auction_name)
        setAuctionDetails(data.auction_details);
        setPlayerId(data.auction_details.current_player);
        sessionStorage.setItem("current_set",data.auction_details.current_set)
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
        "Content-Type": "application/json"
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
        toast.success("Bid raise success")
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
          toast.success("Succesfully set the Set");
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
        AuctionCompletion()  
        setCurrentStatus(statusNames.completed);
        socket.emit("auction-completed",auction_id)
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
    // Important
    socket.emit("start-timer",auction_id)

    socket.emit("refresh");
    fetchAuctionDetails();
  }

  const methods = {PauseAuction,SoldPlayer,UnSoldPlayer,RaiseBid}
  return(
    <div className="bg-gray-50 text-[#323232]">      
      <h1 className="text-[19px] sm:text-[20px] font-semibold  my-5 capitalize">{auctionName}</h1>
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
      (currentStatus === statusNames.pause || currentStatus === statusNames.upcoming)&&
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
          {/* <SuccessModal isOpen={showPopUp} onClose={()=>{setShowPopUp(false)}} msg={popUpMessage}/> */}
        </div>
    }

   {
      (currentStatus === statusNames.completed)&&
      <div className="bg-gray-50  flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Auction Completed</h1>
          <p className="text-gray-600">The auction is completed. Check below the details of the players.</p>
        </div>
      </div>
    }

    </div>
  )
}
