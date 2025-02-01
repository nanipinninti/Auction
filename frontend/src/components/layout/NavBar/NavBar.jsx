import coverImage from "../../../assets/images/cover.png";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Popups
import AccountMenu from "@/components/popup/Login/loginpopup";

export default function NavBar(){
    const loginToken = Cookies.get("customer_token") || Cookies.get("auctioneer_token") || Cookies.get("franchise_token")
    const navigate = useNavigate()
    return(
        <div className="w-screen pr-[20px] sm:h-[60px] flex items-center sm:px-[25px] justify-between shadow-md">
            {/* Left side */}
            <div className="w-auto h-[60px] overflow-hidden cursor-pointer" onClick={()=>{navigate("/")}}>
                <img className="w-auto max-h-[80px] relative top-[-10px] left-[-15px] object-contain" src={coverImage} alt="AuctionArena" />
            </div>


            {/* Right side */}
            <div className="flex items-center gap-[15px] cursor-pointer">
                <div className="text-black">
                    <NotificationsNoneIcon />
                </div>
                <div className="flex items-center">
                    <button className="bg-[#615FFF] flex justify-center items-center rounded px-3 py-[3px] text-white"
                            onClick={()=>{navigate("/login")}}>Login
                    </button>
                    {loginToken&&
                        <div className="text-black cursor-pointer">                        
                            <AccountMenu />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}