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
          <h1 className="text-[22px] font-semibold text-[#FF3D51] mb-4">Completed Auctions</h1>

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

        <div className="flex flex-col sm:flex-row gap-5 sm:gap-2">
            <div className="bg-white w-full sm:w-1/2 p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Features of Our Website</h1>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  Users can host their own cricket tournament auction.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  The auction process is fully automated.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  Owner can select Auctioneers and Teams/Franchises.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  A 30-second timer runs for each bid. If no bid is placed, the player is marked as Sold or Unsold.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  Users can add player details, including stats.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  Teams/Franchises can bid for players in real time.
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✔</span>
                  Non-auctioneers and non-franchise members can watch the auction in real time.
                </li>
              </ul>
            </div>

            {/* How to Use Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h1>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  Sign up for an account.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  Register a tournament.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  Add sets, players, franchises, and auctioneers. (Dashboard section)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  Franchises and auctioneers must sign up to join your tournament.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  The auctioneer starts the auction, and the process runs automatically.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  All franchises must be on time, as only the auctioneer can control the timer once the auction begins.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">➡️</span>
                  Enjoy the experience!
                </li>
              </ul>
            </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
