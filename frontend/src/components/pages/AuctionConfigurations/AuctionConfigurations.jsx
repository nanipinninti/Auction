import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios for API calls
import Swal from "sweetalert2";
import NavBar from "@/components/layout/NavBar/NavBar";
import Footer from "@/components/layout/Footer/footer";
import AddSets from "@/components/features/AddSets/addsets";
import AddPlayers from "@/components/features/AddPlayers/addplayers";
import AddFranchises from "@/components/features/AddFranchises/addfranchises";
import AddAuctioneers from "@/components/features/AddAuctioneers/addauctioneers";
import { IoIosArrowDropup } from "react-icons/io";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { useParams } from "react-router-dom";
import {toast} from "react-toastify"
import isFutureDateTime from "@/utils/isFuture";
import AddNewPlayers from "@/components/features/AddNewPlayers/addnewplayers";

const DOMAIN = import.meta.env.VITE_DOMAIN;


export default function AuctionConfigurations() {
  const [showEdit, setShowEdit] = useState(true);
  const [auctionName, setAuctionName] = useState("");
  const [auctionShortName, setAuctionShortName] = useState("");
  const [auctionDescription, setAuctionDescription] = useState("");
  const [originalImage, setOriginalImage] = useState(null); // Store the original image URL
  const [uploadedImage, setUploadedImage] = useState(null); // Store the temporary uploaded image URL
  const [auctionDate, setAuctionDate] = useState("");
  const [auctionTime, setAuctionTime] = useState("");
  const [minDate, setMinDate] = useState(""); // State to store the minimum date
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const { auction_id } = useParams();
  const auctionId = auction_id;


  // Calculate the minimum date (next day) when the component mounts
  useEffect(() => {
    const today = new Date();
    const minDateString = today.toISOString().split("T")[0];
    setMinDate(minDateString);
  }, []);

  // Fetch auction details on component mount
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(
          `${DOMAIN}/auction/detailsbyid?auction_id=${auctionId}`
        );
        const data = response.data;
        setAuctionName(data.auction_name);
        setAuctionShortName(data.short_name);
        setAuctionDescription(data.description);
        setOriginalImage(`${DOMAIN}${data.auction_img}`); // Set the original image URL
        setAuctionDate(data.auction_date.split("T")[0]); // Extract date part
        setAuctionTime(data.auction_time);
      } catch (error) {
        console.error("Error fetching auction details:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch auction details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  useEffect(() => {
    Swal.fire({
      title: "Instructions",
      html: `
        <ul  style="text-align: left; font-size: 14px; line-height: 1.5; list-style-type: disc;">
        <li><span style="color:red;">Copy Paste</span> will work. So you can copy paste the data.<br/> Ex: From excel with same columns</li>
        <li>Auction <span style="color:red;">WONT START</span> automatically until AUCTIONEER start the auction</li>
        <li>Define all SETs before adding the Players</li>
        <li>Either you can choose others as Auctioneers or you signup as Auctioneer to pick yourself.</li>
        <li>Atmost three Auctioneers you choose</li>
        <li>Use Postimage to generate URL for players</li>
        <li>Franchises must signup to be avail on Franchise Pick List.</li>
        </ul>
      `,
      icon: "info",
      confirmButtonText: "Okay",
      confirmButtonColor: "#2563eb",
    });
  }, []);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Generate a temporary URL for the uploaded image
      setUploadedImage(imageUrl); // Set the uploaded image URL
      setIsImageUploaded(true); // Mark that a new image has been uploaded
    }
  };

  // Handle form submission to update auction details
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isFutureDateTime(auctionDate,auctionTime)){
      toast.error("Date and time should be Future")
      return
    }
    const formData = new FormData();
    formData.append("auction_name", auctionName);
    formData.append("short_name", auctionShortName);
    formData.append("description", auctionDescription);
    formData.append("auction_date", auctionDate);
    formData.append("auction_time", auctionTime);
  
    if (isImageUploaded) {
      const fileInput = document.getElementById("auction_url");
      const file = fileInput.files[0];
      formData.append("auction_img", file); // Append the image file only if it's uploaded
    }
  
    try {
      const response = await axios.put(
        `${DOMAIN}/auction/modify-auction/${auctionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
          withCredentials : true
        }
      );
  
      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: "Auction details updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setOriginalImage(uploadedImage || originalImage); // Update the original image URL after saving
        setUploadedImage(null); // Reset the uploaded image state
        setIsImageUploaded(false); // Reset the image upload flag
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update auction details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating auction details:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating auction details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setShowEdit(false);
    setUploadedImage(null); // Reset the uploaded image state
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-col px-[20px] py-[20px]">
        <div className="w-full max-w-[1400px] m-auto">
          <h1 className="text-xl">Indian Premier League</h1>
          <div className="mt-5 flex flex-col sm:flex-row gap-[25px]">
            {/* LEFT CONFIGURATIONS */}
            <div className="sm:max-w-[300px]">
              <div>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => setShowEdit(!showEdit)}
                >
                  <h1 className="text-xl min-w-[150px]">Edit Basic Details</h1>
                  {!showEdit && <MdOutlineArrowDropDownCircle className="text-[18px]" />}
                  {showEdit && <IoIosArrowDropup className="text-[16px] text-black" />}
                </div>

                {showEdit && (
                  <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div>
                      <img
                        src={uploadedImage || originalImage || "https://via.placeholder.com/200"}
                        alt="logo"
                        className="w-[200px] h-[200px] object-cover rounded-full"
                      />
                      <label
                        htmlFor="auction_url"
                        className="flex items-center gap-1 text-white bg-[#0D1117] border border-[#0D1117] relative top-[-30px] left-2 rounded w-[fit-content] py-[2px] pl-1 pr-2 text-[14px]"
                      >
                        <GoPencil className="text-[12px]" />
                        <h1>Edit</h1>
                      </label>
                      <input
                        type="file"
                        id="auction_url"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Tournament Name</label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                        value={auctionName}
                        placeholder="Tournament Name"
                        onChange={(e) => setAuctionName(e.target.value)}
                        name="auction_name"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Short Name</label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                        value={auctionShortName}
                        placeholder="Short Name"
                        onChange={(e) => setAuctionShortName(e.target.value)}
                        name="short_name"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Description</label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                        value={auctionDescription}
                        placeholder="Describe about the tournament"
                        onChange={(e) => setAuctionDescription(e.target.value)}
                        name="description"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Date</label>
                      <input
                        type="date"
                        className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                        value={auctionDate}
                        placeholder="Auction held date"
                        onChange={(e) => setAuctionDate(e.target.value)}
                        name="auction_date"
                        min={minDate} // Set the minimum date to the next day
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm">Time</label>
                      <input
                        type="time"
                        className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                        value={auctionTime}
                        placeholder="Time"
                        onChange={(e) => setAuctionTime(e.target.value)}
                        name="auction_time"
                      />
                    </div>

                    {/* Save Options */}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-500 p-1 text-sm px-2 rounded-md text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 p-1 text-sm px-2 rounded-md text-white"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* In system Right Configurations */}
            <div className="w-full sm:w-5/6 flex flex-col gap-5">
              {/* To add players */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-10 sm:gap-0">
                <div>
                  <h1 className="text-xl">Add Sets</h1>
                  <AddSets />
                </div>
                <div>
                  <h1 className="text-xl">Add Franchises</h1>
                  <AddFranchises />
                </div>
                <div>
                  <h1 className="text-xl">Add Auctioneers</h1>
                  <AddAuctioneers />
                </div>
              </div>
              <div>
                <h1 className="text-xl">Add Players</h1>
                <AddPlayers />
              </div>
              <div>
                <h1 className="text-xl">Add New Players</h1>
                <AddNewPlayers />
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}