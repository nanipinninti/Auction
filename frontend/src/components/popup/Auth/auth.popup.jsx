import LoginForm from "@/components/common/LoginForm/LoginForm"
import SignupForm from "@/components/common/SignupForm/SignupForm"
import { useState } from "react"

export default function AuthPopUp({closePopup}){
    const [showLogin,setShowLogin] = useState(true)
    return (
        <>
        <div className="fixed top-0 left-0 backdrop-blur-sm w-screen h-screen z-20" onClick={()=>{closePopup()}}>
            
        </div>
        
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit z-30 bg-white rounded">
            <div className="w-full sm:w-[400px] bg-white shadow-lg rounded-md">
                {showLogin&& <LoginForm onSuccess={()=>closePopup()} onSignupClick={()=>setShowLogin(!showLogin)}/>}                
                {!showLogin&& <SignupForm onSuccess={()=>closePopup()} onSigninClick={()=>setShowLogin(!showLogin)}/>}
            </div>
        </div>
        </>
    )
}