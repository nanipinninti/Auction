import NavBar from "@/components/layout/NavBar/NavBar";
import Carousel from "@/components/layout/Carousel/carousel";
import Footer from "@/components/layout/Footer/footer";
import AuctionCard from "@/components/features/AuctionCard/AuctionCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LoadingComponent from "@/components/common/Loader/loader";
import FailureComponent from "@/components/common/Failure/failure";

const DOMAIN = import.meta.env.VITE_DOMAIN;

import Banner_1 from "../../../assets/images/Banner_1.jpeg";
import Banner_2 from "../../../assets/images/Banner_2.jpeg";
import Banner_3 from "../../../assets/images/Banner_3.jpeg";

export default function Home() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  
  // Loading & Error States
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);
  const [errorLive, setErrorLive] = useState(false);
  const [errorCompleted, setErrorCompleted] = useState(false);

  useEffect(() => {
    fetchLiveAuctions();
    fetchCompletedAuctions();
  }, []);

  const slides = [
    { 
      id: 1, 
      image: Banner_1, 
      mobileImage: Banner_1, 
      title: "Host Your Own Cricket Auction!", 
      description: "Organize and manage your tournament’s auction with ease. Register, bid, and build your dream team today!" 
    },
    { 
      id: 2, 
      image: Banner_2, 
      mobileImage: Banner_2, 
      title: "Bid. Win. Play!", 
      description: "Join live player auctions, compete with others, and assemble the strongest squad for your tournament." 
    },
    { 
      id: 3, 
      image: Banner_3, 
      mobileImage: Banner_3, 
      title: "Experience the Thrill of Auctions!", 
      description: "From player registration to final bidding – take full control of your cricket auction like never before!" 
    },
  ];
  

  const fetchLiveAuctions = async () => {
    setIsLoadingLive(true);
    setErrorLive(false);
    
    try {
      const response = await fetch(`${DOMAIN}/auctions/live/`);
      if (response.ok) {
        const data = await response.json();
        setLiveAuctions(data.live_auctions);
      } else {
        setErrorLive(true);
        toast.error("Failed to fetch live auctions. Please try again.");
      }
    } catch (error) {
      setErrorLive(true);
      toast.error("Network error! Unable to fetch live auctions.");
    } finally {
      setIsLoadingLive(false);
    }
  };

  const fetchCompletedAuctions = async () => {
    setIsLoadingCompleted(true);
    setErrorCompleted(false);
    
    try {
      const response = await fetch(`${DOMAIN}/auctions/completed/`);
      if (response.ok) {
        const data = await response.json();
        setCompletedAuctions(data.completedAuctions);
      } else {
        setErrorCompleted(true);
        toast.error("Failed to fetch completed auctions. Please try again.");
      }
    } catch (error) {
      setErrorCompleted(true);
      toast.error("Network error! Unable to fetch completed auctions.");
    } finally {
      setIsLoadingCompleted(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Carousel Section */}
        <div className="mb-8">
          <Carousel slides={slides} />
        </div>

        {/* Live Auctions Section */}
        <div className="mb-8">
          <h1 className="text-[22px]  font-semibold mb-4 text-[#FF3D51]">Live Auctions</h1>

          {isLoadingLive ? (
            <LoadingComponent />
          ) : errorLive ? (
            <FailureComponent message="Failed to load live auctions. Please try again." retryAction = {()=>fetchLiveAuctions()}/>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                (liveAuctions.length === 0)?(
                  <div>
                      <h1 className="text-[16px]">No Ongoing Auctions!</h1>
                  </div>
                ):liveAuctions.map((auction) => (
                  <AuctionCard key={auction._id} auctionDetails={auction} />
                ))
              }
            </div>
          )}
        </div>

        {/* Completed Auctions (Highlights) Section */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-[#FF3D51] mb-4">Highlights</h1>

          {isLoadingCompleted ? (
            <LoadingComponent />
          ) : errorCompleted ? (
            <FailureComponent message="Failed to load highlights. Please try again." retryAction = {()=>fetchCompletedAuctions()}/>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {
              (completedAuctions.length === 0)?(
                <div>
                    <h1 className="text-[16px]">No completed Auctions!</h1>
                </div>
              ):completedAuctions.map((auction) => (
                <AuctionCard key={auction._id} auctionDetails={auction} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
