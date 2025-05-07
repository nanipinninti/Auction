import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const DOMAIN = import.meta.env.VITE_DOMAIN;



const modeNames = {
  customer: "customer",
  auctioneer: "auctioneer",
  franchise: "franchise",
};

export default function AuctionPause(props) {
  const [pickSet, setPickSet] = useState(sessionStorage.getItem("current_set") || 0);
  const [setsInfo, setSetsInfo] = useState([]);

  const { mode, BeginAuction,PickSet } = props;
  const { auction_id } = useParams();

  const ChangeSet = async () => {
    const set_no = pickSet;
    const api =  `${DOMAIN}/auction-actions/pick-set`;
    const options = {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
        set_no,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        toast.success("Succesfully set the Set");
      } else {
        toast.error("Failed to Pick the set, Try again");
      }
    } catch (error) {
      toast.error("Servor Error");
    }
  };

  useEffect(() => {
    fetchSetsInfo();
  }, []);

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
        pickSet(data.sets[0].set_no);
      }
    } catch {
      toast.error("Internal server error");
    }
  };

  const StartAuction = async () => {
    const api = `${DOMAIN}/auction-actions/start-auction`;
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auction_id,
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        BeginAuction();
      } else {
        toast.error("Failed to start the auction, incorrect auction ID");
      }
    } catch (error) {
      toast.error("Failed to start the auction");
    }
  };

  return (
    <div className="bg-gray-50  flex items-center justify-center p-6">
      {mode === modeNames.auctioneer ? (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Auction Pause</h1>

          {/* Pick the Set */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pick the Set</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              value={pickSet}
              onChange={(e) => setPickSet(Number(e.target.value))}
            >
              {setsInfo
                .filter((set) => set.status === "Available")
                .map((set) => (
                  <option key={set.set_no} value={set.set_no}>
                    {set.set_name}
                  </option>
                ))}
            </select>
            <button
              className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              onClick={ChangeSet}
            >
              Save
            </button>
          </div>

          {/* Start Auction Button */}
          <button
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
            onClick={StartAuction}
          >
            Start the Auction
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Auction Paused</h1>
          <p className="text-gray-600">The auction is yet to start. Please wait!</p>
        </div>
      )}
    </div>
  );
}