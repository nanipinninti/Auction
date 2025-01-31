import { useState } from "react";
import coverImage from "../../../assets/images/cover.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
    customer : "customer",
    auctioneer : "auctioneer",
    Franchise : "Franchise"
}


const LoginAPIs = {
    customer: `${DOMAIN}/customer/login`,
    auctioneer: `${DOMAIN}/auctioneer/login`,
    Franchise: `${DOMAIN}/franchise/login`
};

export default function LoginForm(){
    const [mode,setMode] = useState(modeNames.auctioneer)  
    const [username,setUsername] = useState("")  
    const [password,setPassword] = useState("")

    const navigate = useNavigate()
    const onSubmit = async (event) => {
        event.preventDefault();
      
        const api = LoginAPIs[mode];
        const details = {
          franchise_name: username,
          auctioneer_name: username,
          customer_name: username,
          password,
        };
      
        const options = {
          method: "POST",
          credentials: "include", // Corrected typo
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        };
      
        try {
          const response = await fetch(api, options);
          if (response.ok) {
            const data = await response.json();
            if (data.auctioneer_token) {
              Cookies.set("auctioneer_token", data.auctioneer_token, {
                expires: 7,
                path: "/",
                sameSite: "None", // Allow cross-origin cookies
                secure: true, // Required for SameSite=None
              });
              console.log(data.auctioneer_token, Cookies.get("auctioneer_token"));
            }
            if (data.customer_token) {
              Cookies.set("customer_token", data.customer_token, {
                expires: 7,
                path: "/",
                sameSite: "None",
                secure: true,
              });
            }
            if (data.franchise_token) {
              Cookies.set("franchise_token", data.franchise_token, {
                expires: 7,
                path: "/",
                sameSite: "None",
                secure: true,
              });
              Cookies.set("franchise_id", data.franchise._id, {
                expires: 7,
                path: "/",
                sameSite: "None",
                secure: true,
              });
            }
      
            navigate("/");
          } else {
            alert("Incorrect credentials");
          }
        } catch (error) {
          alert("Failed to Login");
        }
      };
      
    return(
        <div className="px-[15px] flex flex-col gap-[10px] pb-[20px] justify-center items-center">
            <div className="h-[70px] overflow-hidden w-full">
                <img src={coverImage} alt="AuctionArena"
                    className="h-[80px] w-auto m-auto"/>
            </div>

            {/* Modes */}
            <div className="flex flex-col items-center w-full">
                <div className="flex justify-center items-center gap-4">
                    <h1 className ={(mode===modeNames.customer)?`text-md text-black font-semibold`:`text-sm text-gray-400`}
                        onClick={()=>{setMode(modeNames.customer)}}
                        style={{cursor:"pointer"}}
                    >
                            User
                    </h1>
                    <h1 className ={(mode===modeNames.auctioneer)?`text-md text-black font-semibold`:`text-sm text-gray-400`}
                        onClick={()=>{setMode(modeNames.auctioneer)}}
                        style={{cursor:"pointer"}}>
                            Auctioneer
                    </h1>
                    <h1 className ={(mode===modeNames.Franchise)?`text-md text-black font-semibold`:`text-sm text-gray-400`}
                        onClick={()=>{setMode(modeNames.Franchise)}}
                        style={{cursor:"pointer"}}>
                            Franchise 
                    </h1>
                </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
                <p className="text-sm">Username</p>
                <input
                    type="text"
                    className="bg-white w-full text-gray-600 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded p-2"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <p className="text-sm">Password</p>
                <input
                    type="password"
                    className="bg-white w-full text-gray-600 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded p-2"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
            </div>

            <div className="w-full">
                <button type="button" 
                    className="bg-blue-400 w-full text-white rounded-md py-1"
                    onClick={onSubmit

                    }>LOGIN</button>
            </div>
        </div>
    )
}