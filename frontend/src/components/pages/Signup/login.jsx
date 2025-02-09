import SignupForm from "@/components/common/SignupForm/SignupForm";
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const navigate = useNavigate()
    return(
        <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center px-[25px]">
            <div className="w-full sm:w-[350px] bg-white shadow-md rounded-md">
                <SignupForm onSuccess={()=>navigate("/")} onSigninClick={()=>navigate("/signin")}/>
            </div>
        </div>
    )
}