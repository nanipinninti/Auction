import { ToastContainer, toast } from 'react-toastify';
  
export default function Toaster(){
const notify = () => toast("Wow so easy!");
    return (
        <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
        </div>
    );
}