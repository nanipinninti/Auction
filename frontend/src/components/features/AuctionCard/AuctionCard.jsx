import { useNavigate } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AuctionCard(props){
    const {auctionDetails} = props
    const navigate = useNavigate()
    const {_id,auction_name,auction_date,auction_img,short_name,description} = auctionDetails
    const DOMAIN = import.meta.env.VITE_DOMAIN;

    return (
        <div className="rounded-md shadow-md rounded-xl overflow-hidden pb-2 min-h-[330px] w-full sm:w-[300px]"
                onClick={()=>{navigate(`auction-room/${_id}`)}}>
            <div >
                <img 
                    className="object-cover h-[250px] w-full"
                    src={`${DOMAIN}${auction_img}`}
                    alt= {auction_name}
                />
            </div>
            <div className="px-[15px] py-[10px]">
                <h1 className="text-[14px]">{short_name}</h1>
                <h1 className="text-[18px]">{auction_name}</h1>
                <h1 className="text-md mt-1 text-[16px]">{description}</h1>
            </div>
        </div>
    )
}