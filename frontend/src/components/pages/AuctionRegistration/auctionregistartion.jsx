import NavBar from "@/components/layout/NavBar/NavBar"
import Footer from "@/components/layout/Footer/footer"
import Cookies from "js-cookie"
import { useState } from "react"
const DOMAIN = import.meta.env.VITE_DOMAIN;

import "./index.css"

export default function AuctionRegistration(){
    const [auctionName,setAuctionName] = useState("")
    const [auctionShortName,setAuctionShortName] = useState("")
    const [auctionDescription,setAuctionDescription] = useState("")
    const [auctionUrl,setAuctionUrl] = useState(null)
    const [auctionDate,setAuctionDate] = useState("") // Corrected state variable name
    const [auctionTime,setAuctionTime] = useState("")

    const RegisterAuction = async () => {
        const api = `${DOMAIN}/auction/add-auction`
        const formData = new FormData()
        formData.append("auction_name", auctionName)
        formData.append("auction_date", auctionDate)
        formData.append("auction_time", auctionTime)
        formData.append("short_name", auctionShortName)
        formData.append("description", auctionDescription)
        formData.append("auction_img", auctionUrl)

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Cookies.get("customer_token") }`
            },
            body: formData
        }
        try{
            const response = await fetch(api, options)
            if (response.ok){
                const data = await response.json()
                alert("Successfully registered")
                console.log(data)
            }else{
                alert("Failed to register")
            }
        }catch(error){
            alert("Internal Server Error")
        }
    }

    return(
        <div>
            <NavBar />
            <div className="flex flex-col px-[20px] py-[20px] flex flex-col items-center">
                <h1 className="text-xl">Auction Registration</h1>
                <div className="w-full max-w-[700px] flex flex-col gap-[10px] my-3">                                    
                    <h1 className="text-[17px]">Tournment Details</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-[5px]">
                            <label>Name</label>
                            <input type="text"
                                className="border border-gray-300 rounded px-[10px] py-[5px] bg-white"
                                value={auctionName} onChange={(e)=>{setAuctionName(e.target.value)}} />
                        </div>

                        <div className="sm:flex w-full sm:gap-[10px]">
                            <div className="flex flex-col gap-[5px] sm:w-1/2">
                                <label>Short Name</label>
                                <input type="text"
                                    className="border border-gray-300 rounded px-[10px] py-[5px] bg-white"
                                    value={auctionShortName} onChange={(e)=>{setAuctionShortName(e.target.value)}} />
                            </div>

                            <div className="flex flex-col gap-[5px] sm:w-1/2">
                                <label>Logo</label>
                                <input type="file"
                                    className="border border-gray-300 rounded px-[10px] py-[5px] bg-white"
                                    onChange={(e)=>{setAuctionUrl(e.target.files[0])}} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px]">
                            <label>Description</label>
                            <textarea type="text" rows="3"
                                className="border border-gray-300 rounded px-[10px] py-[5px] bg-white resize-none"
                                value={auctionDescription} onChange={(e)=>{setAuctionDescription(e.target.value)}} />
                        </div>

                        {/* Auction Date and time */}
                        <div className="sm:flex w-full sm:gap-[10px]">
                            {/* Date Input */}
                            <div className="flex flex-col gap-[5px] sm:w-1/2">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                    value={auctionDate}
                                    onChange={(e) => setAuctionDate(e.target.value)} // Corrected state setter function
                                    style={{ colorScheme: 'dark' }} // Custom style for icon color
                                />
                            </div>

                            {/* Time Input */}
                            <div className="flex flex-col gap-[5px] sm:w-1/2">
                                <label>Time</label>
                                <input
                                    type="time"
                                    className="border border-gray-300 rounded px-[10px] py-[5px] bg-white text-gray-700"
                                    value={auctionTime}
                                    onChange={(e) => setAuctionTime(e.target.value)} // Corrected state setter function
                                    style={{ colorScheme: 'dark' }} // Custom style for icon color
                                />
                            </div>

                        </div>

                        <button type="button" 
                            onClick={RegisterAuction}
                            className="bg-[#3D7AE0] mt-3 w-full max-w-[300px] text-white rounded px-[10px] py-[5px] w-[100px] mx-auto" >
                            Register
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}