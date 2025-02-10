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
import { CiLogin } from "react-icons/ci";


import { useState } from "react";

// popups
import AuthPopUp from "@/components/popup/Auth/auth.popup";
import LogoutPopup from "@/components/popup/Logout/logout.popup";


export default function NavBar(){
    const [showPopup , setShowPopup] = useState(false)
    const [showAuthPopup,setShowAuthPopup] = useState(false)
    const [showLogoutPopup,setShowLogoutPopup] = useState(false)
    
    const loginToken = Cookies.get("authenticated")
    const navigate = useNavigate()

    const popUpOptions = [
        { icon: <FaUserAlt />, label: "Profile", onclick: ()=>{} },
        { icon: <MdSpaceDashboard />, label: "My Tournaments", onclick: ()=>{navigate("/dashboard")} },
        { icon: <IoIosAddCircle />, label: "Register Tournament", onclick : ()=>{navigate("/auction-registration")}},        
        { icon: <CiLogin />, label: "Login", onclick: ()=>{setShowAuthPopup(!showAuthPopup)} },
        { icon: <IoLogOutOutline />, label: "Logout", onclick: ()=>{setShowLogoutPopup(!showLogoutPopup)} }
    ];

    return(
        <div className="w-screen pr-[20px] sm:h-[60px] flex items-center sm:px-[50px] justify-between shadow-md text-[#323232]">
            {/* Left side */}
            <div className="w-auto h-[60px] overflow-hidden cursor-pointer" onClick={()=>{navigate("/")}}>
                <img className="w-auto max-h-[80px] relative top-[-10px] left-[-15px] object-contain" src={coverImage} alt="AuctionArena" />
            </div>


            {/* Right side */}
            <div className="flex items-center gap-[20px] sm:gap-[30px]">
                {Cookies.get("authenticated")&&
                    <div className="sm:flex items-center gap-[15px] sm:gap-[30px] hidden">
                        <h1 className="cursor-pointer hover:text-[#FF3D51]" 
                            onClick={()=>{navigate("/dashboard")}}>
                            My Tournments
                        </h1>

                        <h1 className=" cursor-pointer hover:text-[#FF3D51]" onClick={()=>{navigate("/auction-registration")}}>
                            Register
                        </h1>
                    </div>
                }
                {/* Search */}
                <div>
                    <div className="text-[25px] hover:text-[#FF3D51]">
                        <CiSearch />
                    </div>
                </div>

                <div className="flex items-center">
                    {!loginToken&&
                        <button className="bg-[#615FFF] flex justify-center items-center rounded px-3 py-[3px] text-white"
                            onClick={()=>{setShowAuthPopup(!showAuthPopup)}}>
                                Login
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
                    <div className="absolute right-[40px] sm:right-[50px] bg-white top-[50px] rounded shadow flex flex-col w-[200px] sm:w-[240px] py-3 z-20">
                        <div className="w-full flex justify-center text-[50px] sm:text-[80px] text-blue-500">
                            <FaCircleUser />
                        </div>
                        <div className="w-full text-center my-2">
                            <h1 className="text-[13px]">Welcome Back!</h1>
                            <h1 className="text-[18px] capitalize">
                                {(localStorage.getItem("user_name"))?localStorage.getItem("user_name"):"Do login"}
                            </h1>
                        </div>
                        <hr className="w-full mb-2 mt-1" />
                        {   
                        popUpOptions.map((option,index)=>(
                            <div 
                                key={index}
                                className="flex items-center gap-[15px] cursor-pointer hover:bg-[#f0f0f0] py-1 px-[13px]"
                                onClick={option.onclick}
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

                {showAuthPopup && <AuthPopUp closePopup={()=>{setShowAuthPopup(false);setShowPopup(false)}}/>  }
                {showLogoutPopup && <LogoutPopup closePopup={()=>{setShowLogoutPopup(false);}} />}
            </div>
        </div>
    )
}