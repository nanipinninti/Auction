import LoginForm from "@/components/common/LoginForm/LoginForm"
export default function Login(){
    return(
        <div className="h-screen w-screen bg-base-200 flex flex-col items-center justify-center px-[25px]">
            <div className="w-full sm:w-[350px] bg-white shadow-md rounded-md">
                <LoginForm />
            </div>
        </div>
    )
}