import { useState } from "react";
import NavBar from "@/components/layout/NavBar/NavBar";
import Footer from "@/components/layout/Footer/footer";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // Import SweetAlert for a clean UI

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AuctionRegistration() {
  const [auctionName, setAuctionName] = useState("");
  const [auctionShortName, setAuctionShortName] = useState("");
  const [auctionDescription, setAuctionDescription] = useState("");
  const [auctionUrl, setAuctionUrl] = useState(null);
  const [auctionDate, setAuctionDate] = useState("");
  const [auctionTime, setAuctionTime] = useState("");

  // Get tomorrow's date in YYYY-MM-DD format to disable past dates
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Block today and past dates
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const Instructions = () => {
    Swal.fire({
      title: "After completion of Registration",
      html: `
        <ul  style="text-align: left; font-size: 14px; line-height: 1.5; list-style-type: disc;">
          <li>Do signup as Auctioneer</li>
          <li>Auction <span style="color:red;">WONT START</span> automatically until AUCTIONEER start the auction</li>
          <li>Add required data for the auction in dashboard</li>
          <li>Click 'Confirm' to proceed with registration.</li>
        </ul>
      `,
      icon: "info",
      confirmButtonText: "Okay",
      confirmButtonColor: "#2563eb",
    })
  };

  const RegisterAuction = async () => {
    const api = `${DOMAIN}/auction/add-auction`;
    const formData = new FormData();
    formData.append("auction_name", auctionName);
    formData.append("auction_date", auctionDate);
    formData.append("auction_time", auctionTime);
    formData.append("short_name", auctionShortName);
    formData.append("description", auctionDescription);
    formData.append("auction_img", auctionUrl);

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${Cookies.get("customer_token")}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json();
        toast.success("Successfully registered");
        Instructions()
      } else {
        toast.error("Failed to register");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="flex flex-col items-center px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Auction Registration</h1>
        <div className="w-full max-w-[700px] bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tournament Details</h2>
          <div className="flex flex-col gap-4">
            {/* Auction Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                value={auctionName}
                onChange={(e) => setAuctionName(e.target.value)}
                placeholder="Ex: Indian Premier League"
                style={{ fontSize: "14px" }} // Reduce placeholder size
              />
            </div>

            {/* Short Name and Logo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Short Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  value={auctionShortName}
                  onChange={(e) => setAuctionShortName(e.target.value)}
                  placeholder="Ex: IPL"
                  style={{ fontSize: "14px" }} // Reduce placeholder size
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  onChange={(e) => setAuctionUrl(e.target.files[0])}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-700"
                value={auctionDescription}
                onChange={(e) => setAuctionDescription(e.target.value)}
                placeholder="Describe your tournament"
                style={{ fontSize: "14px" }} // Reduce placeholder size
              />
            </div>

            {/* Auction Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  value={auctionDate}
                  onChange={(e) => setAuctionDate(e.target.value)}
                  min={getMinDate()} // Block past dates
                  style={{ fontSize: "14px" }} // Reduce placeholder size
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  value={auctionTime}
                  onChange={(e) => setAuctionTime(e.target.value)}
                  style={{ fontSize: "14px" }} // Reduce placeholder size
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={RegisterAuction}
              className="w-full max-w-[300px] mx-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
