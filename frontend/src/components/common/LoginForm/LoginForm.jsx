import { useState } from "react";
import coverImage from "../../../assets/images/cover.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
    customer: "customer",
    auctioneer: "auctioneer",
    Franchise: "Franchise"
};

const LoginAPIs = {
    customer: `${DOMAIN}/customer/login`,
    auctioneer: `${DOMAIN}/auctioneer/login`,
    Franchise: `${DOMAIN}/franchise/login`
};

export default function LoginForm({onSuccess,onSignupClick}) {
    const [mode, setMode] = useState(modeNames.customer);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return false;
        }
        setError("");
        return true;
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const api = LoginAPIs[mode];
        const details = {
            franchise_name: username,
            auctioneer_name: username,
            customer_name: username,
            password
        };
        
        try {
            const response = await fetch(api, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });
            
            const data = await response.json();
            setLoading(false);
            
            if (response.ok) {
                toast.success("Login Success")
                if (data.franchise) {
                    Cookies.set("franchise_id", data.franchise._id, { expires: 7 });
                }
                if(data.customer){
                    Cookies.set("authenticated",true,{expires : 7})
                    localStorage.setItem("user_name",data.customer.customer_name)
                }
                onSuccess()
            } else {
                setError(data.message || "Incorrect credentials");
            }
        } catch (error) {
            setLoading(false);
            setError("Server busy. Try again later.");
        }
    };

    return (
        <div className="px-4 flex flex-col gap-4 pb-6 justify-center items-center">
            <div className="h-[70px] overflow-hidden w-full">
                <img src={coverImage} alt="AuctionArena" className="h-[80px] w-auto m-auto"/>
            </div>

            {/* Modes */}
            <div className="flex justify-center gap-4">
                {Object.values(modeNames).map((m) => (
                    <h1 key={m} 
                        className={`cursor-pointer ${mode === m ? "text-black font-semibold" : "text-gray-400"}`}
                        onClick={() => setMode(m)}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                    </h1>
                ))}
            </div>

            {error && (
                <motion.div 
                    className="text-red-500 text-sm bg-red-100 p-2 rounded-md w-full text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}>
                    {error}
                </motion.div>
            )}

            <div className="flex flex-col gap-2 w-full">
                <p className="text-sm">Username</p>
                <input type="text"
                    className="bg-white w-full text-gray-600 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded p-2"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 w-full">
                <p className="text-sm">Password</p>
                <input type="password"
                    className="bg-white w-full text-gray-600 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded p-2"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="w-full">
                <button type="button" 
                    className="bg-blue-400 w-full text-white rounded-md py-2 transition-all duration-300 hover:bg-blue-500 disabled:bg-gray-300"
                    onClick={onSubmit}
                    disabled={loading}>
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
            </div>
            <h1 className="text-[13px] cursor-pointer">Not having Account?
                 <span className="text-blue-700" onClick={()=>{onSignupClick()}}> Signup</span>
            </h1>
        </div>
    );
}
