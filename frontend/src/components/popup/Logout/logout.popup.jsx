import { CgDanger } from "react-icons/cg";
const DOMAIN = import.meta.env.VITE_DOMAIN;
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LogoutPopup({closePopup}){
    const LogoutExecution = async ()=>{
        const LogoutAPI = `${DOMAIN}/customer/logout`
        const options = {
              method: "GET",
              credentials: "include"
            }
        try{
            const response = await fetch(LogoutAPI,options)
            if (response.ok){
                Cookies.remove("authenticated")
                localStorage.removeItem("user_name")
                toast.success("Logout success")
            }else{
                toast.error("Something went wront, please try again!")
            }
        }catch(error){
            toast.error("Internal server Error!")
        }
        finally{
            closePopup()
        }    
    }
    return(
        <>
        <div className="fixed top-0 left-0 backdrop-blur-sm w-screen h-screen z-20" onClick={()=>{closePopup()}}>
            
        </div>
        
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit z-20 bg-white rounded-md shadow-lg">
           <div className="flex p-5 gap-4 items-center w-[300px]">
                <div>
                    <div className="text-red-500 text-[40px] sm:text-[50px]">
                        <CgDanger />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="text-[14px]">Are you sure want to Logut?</h1>
                    <div className="flex gap-5">
                        <button
                            onClick={LogoutExecution}
                            className="bg-green-500 text-[11px] sm:text-[13px] min-w-[50px] text-white rounded p-1">Yes</button>
                        <button 
                            onClick={()=>{closePopup()}}
                            className="bg-gray-800 text-[11px] sm:text-[13px] min-w-[50px] text-white rounded p-1">
                        No
                        </button>
                    </div>
                </div>
           </div>
        </div>
        </>
)
}