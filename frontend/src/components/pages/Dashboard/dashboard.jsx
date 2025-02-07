import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const DOMAIN = import.meta.env.VITE_DOMAIN;

import NavBar from "@/components/layout/NavBar/NavBar";
import Footer from "@/components/layout/Footer/footer";
// icons
import { FaPlus } from "react-icons/fa6";

// utils
import formatDateToReadable from "@/utils/format.date.to.readable";
import formatTimeToAmPm from "@/utils/time.format";

const Options = [
  {
    id: 1,
    name: "All",
    api: `${DOMAIN}/dashboard/auctions`,
  },
  {
    id: 2,
    name: "Live",
    api: `${DOMAIN}/dashboard/auctions?status=ongoing`,
  },
  {
    id: 3,
    name: "Completed",
    api: `${DOMAIN}/dashboard/auctions?status=completed`,
  },
  {
    id: 4,
    name: "Upcoming",
    api: `${DOMAIN}/dashboard/auctions?status=upcoming`,
  },
];

export default function Dashboard() {
  const [currentOption, setCurrentOption] = useState(Options[0]);
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, [currentOption]);

  const fetchAuctions = async () => {
    const api = currentOption.api;
    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions);
      } else {
        alert("Failed to fetch");
      }
    } catch {
      alert("Internal Server Error");
    }
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen">
      <NavBar />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Auctions</h1>
          <button
            onClick={() => navigate("/auction-registration")}
            className="flex items-center gap-2 bg-[#1DCEF5] text-white rounded-lg px-4 py-2 hover:bg-[#1AB9E0] transition-all duration-300"
          >
            <FaPlus className="text-sm" />
            <span className="text-sm">Add Auction</span>
          </button>
        </div>

        {/* Options Tabs */}
        <div className="mb-8">
          <ul className="flex gap-4 border-b border-gray-200">
            {Options.map((option) => (
              <li
                key={option.id}
                onClick={() => setCurrentOption(option)}
                className={`cursor-pointer px-4 py-2 text-sm font-medium ${
                  currentOption.id === option.id
                    ? "text-[#1DCEF5] border-b-2 border-[#1DCEF5]"
                    : "text-gray-500 hover:text-gray-700"
                } transition-all duration-300`}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Auctions List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction._id}
              onClick={() => navigate(`/auction-configurations/${auction._id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <img
                src={`${DOMAIN}${auction.auction_img}`}
                alt="auction"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h1 className="text-lg font-semibold text-gray-800 uppercase">
                    {auction.auction_name}
                  </h1>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      auction.status === "ongoing"
                        ? "bg-green-100 text-green-600"
                        : auction.status === "completed"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {auction.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <h1 className="text-xs text-gray-500">Tournament Name</h1>
                    <h1 className="text-sm text-gray-800">{auction.short_name}</h1>
                  </div>
                  <div>
                    <h1 className="text-xs text-gray-500">Date</h1>
                    <h1 className="text-sm text-gray-800">
                      {formatDateToReadable(auction.auction_date)}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-xs text-gray-500">Time</h1>
                    <h1 className="text-sm text-gray-800">
                      {formatTimeToAmPm(auction.auction_time)}
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-xs text-gray-500">Description</h1>
                    <h1 className="text-sm text-gray-800">{auction.description}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}