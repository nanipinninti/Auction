import NavBar from "@/components/layout/NavBar/NavBar"
import Carousel from "@/components/layout/Carousel/carousel "
import Footer from "@/components/layout/Footer/footer"
import AuctionCard from "@/components/features/AuctionCard/AuctionCard"
import { useEffect, useState } from "react"
const DOMAIN = import.meta.env.VITE_DOMAIN;

import Banner_1 from "../../../assets/images/Banner_1.jpeg";
import Banner_2 from "../../../assets/images/Banner_2.jpeg";
import Banner_3 from "../../../assets/images/Banner_3.jpeg";


export default function Home(){
    const [liveAuctions,setLiveAuctions] = useState([])    
    const [completedAuctions,setCompletedAuctions] = useState([])
    useEffect(()=>{
        fetchLiveAuctions()
        fetchCompletedAuctions()
    },[])
    const slides = [
        {
          id: 1,
          image: Banner_1,
          mobileImage: Banner_1, // Example mobile image
          title: "First slide label",
          description: "Some representative placeholder content for the first slide.",
        },
        {
          id: 2,
          image: Banner_2,
          mobileImage:  Banner_2,
          title: "Second slide label",
          description: "Some representative placeholder content for the second slide.",
        },
        {
          id: 3,
          image:   Banner_3,
          mobileImage:  Banner_3,
          title: "Third slide label",
          description: "Some representative placeholder content for the third slide.",
        },
      ];
    
    const fetchLiveAuctions = async ()=>{
        const api = `${DOMAIN}/auctions/live/`
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
        const api = `${DOMAIN}/auctions/completed/`
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
            <div className="px-[20px] sm:px-[25px] mt-3">
                <Carousel slides={slides} />
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