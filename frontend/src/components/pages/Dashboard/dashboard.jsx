import {useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

import NavBar from "@/components/layout/NavBar/NavBar"
import Footer from "@/components/layout/Footer/footer"
// icons
import { FaPlus } from "react-icons/fa6";

// utils
import formatDateToReadable from "@/utils/format.date.to.readable"
import formatTimeToAmPm from "@/utils/time.format"

const Options = [
    {
        id : 1,
        name : "All",
        api : "http://localhost:5001/dashboard/auctions"
    },
    {
        id : 2,
        name : "Live",
        api : "http://localhost:5001/dashboard/auctions?status=ongoing"
    },
    {
        id : 3,
        name : "Completed",
        api : "http://localhost:5001/dashboard/auctions?status=completed"
    },
    {
        id : 4,
        name : "Upcoming",
        api : "http://localhost:5001/dashboard/auctions?status=upcoming"
    }
]

export default function Dashboard(){
    const [currentOption , setCurrentOption] = useState(Options[0])
    const [auctions, setAuctions] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
        fetchAuctions()
    },[currentOption])

    const fetchAuctions = async () => {
        const api = currentOption.api
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("customer_token")}`
            }
        }
        try{
            const response = await fetch(api,options)
            if (response.ok){
                const data = await response.json()
                // console.log(data)
                setAuctions(data.auctions)
            }else{
                alert("Failed to fetch")
            }
        }catch{
            alert("Internal Server Error")
        }
    }

    return(
        <div className="bg-[#F5F5F7]">
            <NavBar />
            <div className="flex flex-col px-[20px] py-[20px] flex flex-col">
                {/* top */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl">My Auctions</h1>
                    <div 
                        onClick={()=>{navigate("/auction-registration")}}
                        className="flex items-center gap-[10px] bg-[#1DCEF5] text-white rounded px-2 py-1 cursor-pointer">                        
                        <FaPlus className="text-[11px]" />
                        <h1 className="pb-[2px] text-[12px]"> Add auction</h1>
                    </div>
                </div>

                <div className="mt-5">
                    {/* Options */}
                    <ul className="flex p-0 m-0 gap-5">
                    {
                        Options.map((option)=>{
                            return(
                                <li key={option.id} 
                                onClick={()=>{setCurrentOption(option)}}
                                className={`cursor-pointer text-[14px] ${currentOption.id === option.id ? "font-semibold" : ""}`}>
                                    <h1 >{option.name}</h1>
                                </li>
                            )
                        })
                    }
                    </ul>

                    {/* Auctions List*/}
                    <div className="mt-5 flex flex-col sm:flex-row  sm:gap-[20px]">
                        {
                            auctions.map((auction)=>{
                                return(
                                <div key={auction._id} className="flex flex-col gap-3 shadow border sm:w-[380px] rounded-md px-4 pt-4 pb-5 mt-2"
                                    onClick={()=>{navigate("/aution-configurations")}}>
                                        <div className="flex justify-between gap-5">
                                            <h1 className="text-[17px] uppercase">{auction.auction_name}</h1>
                                            <h1 className="text-[14px]">{auction.status}</h1>
                                        </div>
                                        <div className="flex gap-4">                                          
                                            <div className="3/5">
                                                <img src={auction.auction_img} alt="auction" 
                                                className="w-[200px] h-[230px] object-cover rounded" />
                                            </div>
                                            <div className="flex flex-col gap-2 w-2/5">  
                                                <div>
                                                    <h1 className="text-[12px]">Tournment Name</h1>                            
                                                    <h1 className="text-[14px]">{auction.short_name}</h1>
                                                </div>

                                                <div>
                                                    <h1 className="text-[12px]">Date</h1>
                                                    <h1 className="text-[14px]">{formatDateToReadable(auction.auction_date)}</h1>
                                                </div>

                                                <div>
                                                    <h1 className="text-[12px]">Time</h1>
                                                    <h1 className="text-[14px]">{formatTimeToAmPm(auction.auction_time)}</h1>
                                                </div>

                                                <div>
                                                    <h1 className="text-[12px]">Description</h1>
                                                    <h1 className="text-[14px]">{auction.description}</h1>
                                                </div>                                            
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}


