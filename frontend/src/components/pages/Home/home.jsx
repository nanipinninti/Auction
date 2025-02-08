import NavBar from "@/components/layout/NavBar/NavBar";
import Carousel from "@/components/layout/Carousel/carousel";
import Footer from "@/components/layout/Footer/footer";
import AuctionCard from "@/components/features/AuctionCard/AuctionCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

import Banner_1 from "../../../assets/images/Banner_1.jpeg";
import Banner_2 from "../../../assets/images/Banner_2.jpeg";
import Banner_3 from "../../../assets/images/Banner_3.jpeg";

export default function Home() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);

  useEffect(() => {
    fetchLiveAuctions();
    fetchCompletedAuctions();
  }, []);

  const slides = [
    { id: 1, image: Banner_1, mobileImage: Banner_1, title: "First slide label", description: "Some representative placeholder content for the first slide." },
    { id: 2, image: Banner_2, mobileImage: Banner_2, title: "Second slide label", description: "Some representative placeholder content for the second slide." },
    { id: 3, image: Banner_3, mobileImage: Banner_3, title: "Third slide label", description: "Some representative placeholder content for the third slide." },
  ];

  const fetchLiveAuctions = async () => {
    const api = `${DOMAIN}/auctions/live/`;
    try {
      const response = await fetch(api);
      if (response.ok) {
        const data = await response.json();
        setLiveAuctions(data.live_auctions);
      } else {
        toast.error("Failed to fetch live auctions. Please try again.");
      }
    } catch (error) {
      toast.error("Network error! Unable to fetch live auctions.");
    }
  };

  const fetchCompletedAuctions = async () => {
    const api = `${DOMAIN}/auctions/completed/`;
    try {
      const response = await fetch(api);
      if (response.ok) {
        const data = await response.json();
        setCompletedAuctions(data.completedAuctions);
      } else {
        toast.error("Failed to fetch completed auctions. Please try again.");
      }
    } catch (error) {
      toast.error("Network error! Unable to fetch completed auctions.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Carousel Section */}
        <div className="mb-8">
          <Carousel slides={slides} />
        </div>

        {/* Live Auctions Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Live Auctions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <AuctionCard key={auction._id} auctionDetails={auction} />
            ))}
          </div>
        </div>

        {/* Completed Auctions Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Highlights</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAuctions.map((auction) => (
              <AuctionCard key={auction._id} auctionDetails={auction} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
