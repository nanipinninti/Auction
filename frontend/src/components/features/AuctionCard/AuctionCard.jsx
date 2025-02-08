import { useNavigate } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

export default function AuctionCard(props) {
  const { auctionDetails } = props;
  const navigate = useNavigate();
  const { _id, auction_name, auction_date, auction_img, short_name, description } = auctionDetails;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 w-full sm:w-[300px]"
      onClick={() => navigate(`/auction-room/${_id}`)}
    >
      {/* Image Section */}
      <div className="relative h-[200px] w-full">
        <img
          className="object-cover w-full h-full"
          src={`${DOMAIN}${auction_img}`}
          alt={auction_name}
        />
      </div>

      {/* Content Section */}
      <div className="p-4 ">
        {/* Short Name */}
        <h1 className="text-sm text-gray-500 uppercase font-medium mb-[1px]">{short_name}</h1>

        {/* Auction Name */}
        <h1 className="text-[17px] font-bold text-gray-800 mb-[5px]">{auction_name}</h1>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        {/* Auction Date */}
        <div className="mt-3">
          <h1 className="text-xs text-gray-500">Auction Date</h1>
          <h1 className="text-sm text-gray-800">{new Date(auction_date).toLocaleDateString()}</h1>
        </div>
      </div>
    </div>
  );
}