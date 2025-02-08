import { useEffect, useState } from "react"
import Cookies from "js-cookie"
const DOMAIN = import.meta.env.VITE_DOMAIN;

import NavBar from "@/components/layout/NavBar/NavBar"
import Footer from "@/components/layout/Footer/footer"
import AddSets from "@/components/features/AddSets/addsets"

// icons
import { IoIosArrowDropup } from "react-icons/io";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import AddPlayers from "@/components/features/AddPlayers/addplayers"
import AddFranchises from "@/components/features/AddFranchises/addfranchises"
import AddAuctioneers from "@/components/features/AddAuctioneers/addauctioneers"


const src =
    "https://www.jagranimages.com/images/newimg/21082020/21_08_2020-ipl_logo_20650553.jpg";

export default function AuctionConfigurations(){
    const [showEdit,setShowEdit] = useState(true)

    const [auctionName,setAuctionName] = useState("")
    const [auctionShortName,setAuctionShortName] = useState("")
    const [auctionDescription,setAuctionDescription] = useState("")
    const [auctionUrl,setAuctionUrl] = useState(null)
    const [auctionDate,setAuctionDate] = useState("") // Corrected state variable name
    const [auctionTime,setAuctionTime] = useState("")
    return (
        <div>
            <NavBar />
            <div className="flex flex-col px-[20px] py-[20px]">
                <div className="w-full max-w-[1400px] m-auto ">
                    <h1 className="text-xl">Indian Premier League</h1>
                    <div className="mt-5 flex flex-col sm:flex-row gap-[25px]">
                        {/* LEFT CONFIGURATIONS */}
                        <div className="sm:max-w-[300px]">
                            <div>

                                <div className="flex gap-2 items-center cursor-pointer" onClick={()=>{setShowEdit(!showEdit)}}>
                                    <h1 className="text-xl min-w-[150px]">Edit Basic Details</h1>
                                    {!showEdit&&
                                    <MdOutlineArrowDropDownCircle className="text-[18px]"/>
                                    }
                                    {showEdit&&
                                    <IoIosArrowDropup className="text-[16px]  text-black"/>
                                    }
                                </div>

                                {showEdit && 
                                <form className="mt-2 flex flex-col gap-2">

                                <div className="">
                                    <img src={src} alt="logo" 
                                    className="w-[200px] h-[200px] object-cover rounded-full"
                                    />
                                    <label htmlFor="auction_url" className="flex items-center gap-1 text-white bg-[#0D1117] border border-[#0D1117] 
                                                relative top-[-30px] left-2 rounded w-[fit-content] py-[2px] pl-1 pr-2 text-[14px]">
                                        <GoPencil className="text-[12px]"/>                                    
                                        <h1>Edit</h1>
                                    </label>
                                    <input type="file" 
                                        id="auction_url"
                                        value={auctionUrl}
                                        onChange={(e)=>setAuctionUrl(e.target.files[0])}
                                        className="hidden"
                                    />
                                </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Tournment Name</label>
                                        <input  type="text"
                                            className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                            value={auctionName}
                                            placeholder="Tournment Name"
                                            onChange={(e)=>setAuctionName(e.target.value)}
                                            name="auction_name"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Short Name</label>
                                        <input  type="text"
                                            className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                            value={auctionShortName}
                                            placeholder="Short Name"
                                            onChange={(e)=>setAuctionShortName(e.target.value)}
                                            name="short_name"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Description</label>
                                        <input  type="text"
                                            className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                            value={auctionDescription}
                                            placeholder="Describe about the tournment"
                                            onChange={(e)=>setAuctionDescription(e.target.value)}
                                            name="description"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Date</label>
                                        <input  type="date"
                                            className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                            value={auctionDate}
                                            placeholder="Auction held date"
                                            onChange={(e)=>setAuctionDate(e.target.value)}
                                            name="auction_date"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Time</label>
                                        <input  type="time"
                                            className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                            value={auctionTime}
                                            placeholder="Time"
                                            onChange={(e)=>setAuctionTime(e.target.value)}
                                            name="auction_time"
                                        />
                                    </div>
                                    
                                    {/* Save Options */}
                                    <div className="flex gap-2">
                                        <button className="bg-green-500 p-1 text-sm px-2 rounded-md text-white">
                                            Save
                                        </button>
                                        
                                        <button className="bg-green-500 p-1 text-sm px-2 rounded-md text-white">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                                }
                            </div>
                        </div>

                        {/* In system Right Configurations */}
                        <div className="w-full sm:w-5/6 flex flex-col gap-5">
                            {/* To add players */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-10 sm:gap-0">
                                <div >
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}