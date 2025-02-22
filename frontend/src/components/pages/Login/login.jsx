import LoginForm from "@/components/common/LoginForm/LoginForm"
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate()
    return(
        <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center px-[25px]">
            <div className="w-full sm:w-[350px] bg-white shadow-md rounded-md">
                <LoginForm onSuccess={()=>navigate("/")} onSignupClick={()=>navigate("/signup")}/>
            </div>
        </div>
    )
}