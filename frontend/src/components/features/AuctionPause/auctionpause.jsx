
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
    customer: "customer",
    auctioneer: "auctioneer",
    franchise: "franchise",
};

export default function AuctionPause(props) {   
     
    const [pickSet, setPickSet] = useState(1);  
    const [setsInfo, setSetsInfo] = useState([]);

    const {mode,PickSet,BeginAuction} = props

    const {auction_id} = useParams()

    useEffect(()=>{
        fetchSetsInfo();
    },[])

    const fetchSetsInfo = async () => {
        const api = `${DOMAIN}/auction-details/remaining-sets?auction_id=${auction_id}`;
        const options = {
            method: "GET",
        };
        try {
            const response = await fetch(api, options);
            if (response.ok) {
            const data = await response.json();
            setSetsInfo([...data.sets]);
            }
        } catch {
            alert("Internal servor error");
    }   
    }

    
    const StartAuction = async () => {
        const api = `${DOMAIN}/auction-actions/start-auction`;
        const options = {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            auction_id,
          }),
        };
        try {
          const response = await fetch(api, options);
          if (response.ok) {
            BeginAuction()
          } else {
            alert("failed to start the auction , incorrect auction id");
          }
        } catch (error) {
          alert("Failed to start the auction");
        }
      };

    return (
    <div>
        {
        (mode === modeNames.auctioneer )? (
            <div className="flex flex-col items-center gap-4">
                {/* Profile and stats */}
                <div className="px-4 rounded-xl text-sm py-3">
                <h1>Pick the Set</h1>
                <select
                    className="bg-transparent text-black border rounded w-[200px] p-2 mt-2"
                    id="current-set"
                    onChange={(e) => setPickSet(Number(e.target.value))} // Handle selection change
                >
                    {setsInfo
                    .filter((set) => set.status === "Available") // Filter available sets
                    .map((set) => (
                        <option key={set.set_no} value={set.set_no}>
                        {set.set_name} {/* Display set name */}
                        </option>
                    ))}
                </select>
                <button
                    className="block bg-green-400 rounded text-white p-2 py-1 mt-2"
                    onClick={() => {
                    PickSet();
                    }}
                >
                    Save
                </button>
                </div>
                <div className="bg-[#615FFF] text-white px-4 rounded-xl text-sm py-3">
                <button onClick={StartAuction}>Start the auction</button>
                </div>
            </div>
        ) : (
        <div className="mt-3 min-h-screen">
            <h1>Auction Yet to be Start! Please Wait !</h1>
        </div>
        )}
    </div>
    );

}
