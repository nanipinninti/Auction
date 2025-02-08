import {useParams} from "react-router-dom"
import LiveRoom from "@/components/features/LiveRoom/LiveRoom"
import NavBar from "@/components/layout/NavBar/NavBar"
import { useEffect } from "react"
import Footer from "@/components/layout/Footer/footer";
import PlayerStatus from "@/components/features/PlayersStatus/playersstatus";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const constNames = {
    completed : "completed",
    break : "break",
    live : "ongoing"
}
export default function AuctionRoom(){
    const {auction_id} = useParams()
    useEffect(()=>{
        fetchFranchiseDetails()
    },[auction_id])

    const fetchFranchiseDetails= async()=>{
        const api = `${DOMAIN}/auction/franchises?auction_id=${auction_id}`
        const options = {
            method: "GET"
        };
        
        try{
            const response = await fetch(api,options)
            if (response.ok){    
                const data = await response.json()
                sessionStorage.setItem("franchise_details",JSON.stringify(data))
            }else{
                toast.error("Failed to Fetch to Franchise Details")
            }
        }catch(error){
            toast.error("Servor Error")
        }
    }
    
    return(
        <div className="bg-gray-50 min-h-screen min-w-screen text-[#323232]">
            <NavBar />
            <div className="px-[25px] sm:px-[30px] mt-3 max-w-[1400px] mx-auto">
                <LiveRoom />
            </div>
            <div>
                <PlayerStatus />
            </div>
            <Footer/>
        </div>
    )
}