import coverImage from "../../../assets/images/cover.png";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { FaCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

import { useState } from "react";

const popUpOptions = [
    { icon: <FaUserAlt />, label: "Profile", path: "#" },
    { icon: <MdSpaceDashboard />, label: "My Tournaments", path: "/dashboard" },
    { icon: <IoIosAddCircle />, label: "Register", path: "/auction-registration" },
    { icon: <IoLogOutOutline />, label: "Logout", path: "#" }
];
export default function NavBar(){
    const [showPopup , setShowPopup] = useState(false)
    const loginToken = Cookies.get("authenticated")
    const navigate = useNavigate()
    return(
        <div className="w-screen pr-[20px] sm:h-[60px] flex items-center sm:px-[50px] justify-between shadow-md text-[#323232]">
            {/* Left side */}
            <div className="w-auto h-[60px] overflow-hidden cursor-pointer" onClick={()=>{navigate("/")}}>
                <img className="w-auto max-h-[80px] relative top-[-10px] left-[-15px] object-contain" src={coverImage} alt="AuctionArena" />
            </div>


            {/* Right side */}
            <div className="flex items-center gap-[20px] sm:gap-[30px]">

                <div className="sm:flex items-center gap-[15px] sm:gap-[30px] hidden">
                    <h1 className="cursor-pointer hover:text-[#FF3D51]" 
                        onClick={()=>{navigate("/dashboard")}}>
                        My Tournments
                    </h1>

                    <h1 className=" cursor-pointer hover:text-[#FF3D51]" onClick={()=>{navigate("/auction-registration")}}>
                        Register
                    </h1>
                </div>
                {/* Search */}
                <div>
                    <div className="text-[25px] hover:text-[#FF3D51]">
                        <CiSearch />
                    </div>
                </div>

                <div className="flex items-center">
                    {!loginToken&&
                        <button className="bg-[#615FFF] flex justify-center items-center rounded px-3 py-[3px] text-white"
                            onClick={()=>{navigate("/login")}}>Login
                        </button>
                    }
                    {loginToken&&
                    <div className="hover:text-[#FF3D51]">
                        <div className="text-[25px] cursor-pointer" onClick={()=>{setShowPopup(!showPopup)}}> 
                            <FaCircleUser />
                        </div>
                    </div>
                    }
                </div>

                {/* Popup */}
                {
                    showPopup&&
                    <div className="top-0 left-0 h-screen w-screen bg-transparent fixed z-10" onClick={()=>setShowPopup(false)}>

                    </div>
                }
                {showPopup &&
                    <div className="absolute right-[40px] sm:right-[50px] bg-white top-[50px] rounded shadow flex flex-col w-[180px] sm:w-[220px] py-3 z-20">
                        <div className="w-full flex justify-center text-[50px] sm:text-[80px] text-blue-500">
                            <FaCircleUser />
                        </div>
                        <div className="w-full text-center my-2">
                            <h1 className="text-[13px]">Welcome Back!</h1>
                            <h1 className="text-[18px]">Nani Pinninti</h1>
                        </div>
                        <hr className="w-full mb-2 mt-1" />
                        {   
                        popUpOptions.map((option,index)=>(
                            <div 
                                key={index}
                                className="flex items-center gap-[15px] cursor-pointer hover:bg-[#f0f0f0] py-1 px-[13px]"
                                onClick={() => option.path !== "#" && navigate(option.path)}
                            >
                                <div className="text-[15px]">
                                    {option.icon}
                                </div>
                                <h1 className="text-[14px]">
                                    {option.label}
                                </h1>
                            </div>
                        ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}