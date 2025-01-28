import {useParams} from "react-router-dom"
import LiveRoom from "@/components/features/LiveRoom/LiveRoom"
import NavBar from "@/components/layout/NavBar/NavBar"
import { useEffect } from "react"
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
        const api = `http://localhost:5001/auction/franchises?auction_id=${auction_id}`
        const options = {
            method: "GET"
        };
        
        try{
            const response = await fetch(api,options)
            if (response.ok){    
                const data = await response.json()
                sessionStorage.setItem("franchise_details",JSON.stringify(data))
            }else{
                alert("Failed to Fetch to Franchise Details")
            }
        }catch(error){
            alert("Servor Error")
        }
    }
    
    return(
        <div className="min-h-screen min-w-screen">
            <NavBar />
            <div className="px-[25px] sm:px-[30px] mt-3">
                <h1 className="text-xl font-semibold">GPL</h1>
                <LiveRoom />
            </div>
        </div>
    )
}