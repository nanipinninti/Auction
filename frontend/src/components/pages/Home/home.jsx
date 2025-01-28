import NavBar from "@/components/layout/NavBar/NavBar"
import Footer from "@/components/layout/Footer/footer"
import AuctionCard from "@/components/features/AuctionCard/AuctionCard"
import { useEffect, useState } from "react"
export default function Home(){
    const [liveAuctions,setLiveAuctions] = useState([])    
    const [completedAuctions,setCompletedAuctions] = useState([])
    useEffect(()=>{
        fetchLiveAuctions()
        fetchCompletedAuctions()
    },[])

    const fetchLiveAuctions = async ()=>{
        const api = "http://localhost:5001/auctions/live"
        const options = {
            method : "GET"
        }
        try{
            const response = await fetch(api,options)
            if (response.ok){
                const data = await response.json()
                setLiveAuctions(data.live_auctions)
            }else{
                alert("Internal servor error")
            }
        }catch(error){
            alert("Failed to fetch")
        }
    }

    const fetchCompletedAuctions = async ()=>{
        const api = "http://localhost:5001/auctions/completed"
        const options = {
            method : "GET"
        }
        try{
            const response = await fetch(api,options)
            if (response.ok){
                const data = await response.json()
                setCompletedAuctions(data.completedAuctions)
            }else{
                alert("Internal servor error")
            }
        }catch(error){
            alert("Failed to fetch")
        }
    }

    return (
        <div>
            <NavBar />
            <div className="px-[20px] sm:px-[25px]">
                {/* OnGoing auctons*/}
                <div className="py-[20px]">
                    <h1 className="text-2xl">Live Auctions</h1>
                    <div className="flex flex-col sm:flex-row gap-5 mt-5">
                    {
                        liveAuctions.map(auction=>(
                            <AuctionCard key={auction._id} auctionDetails = {auction} />
                        ))
                    }
                    </div>
                </div>

                {/* Past auctons*/}
                <div className="py-[20px]">
                    <h1 className="text-2xl">Highlights</h1>
                    <div className="flex flex-col sm:flex-row gap-5 mt-5">
                    {
                        completedAuctions.map(auction=>(
                            <AuctionCard key={auction._id} auctionDetails = {auction} />
                        ))
                    }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}