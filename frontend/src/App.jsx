import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/pages/Home/home';
import Login from './components/pages/Login/login';
import AuctionRoom from './components/pages/AuctionRoom/AuctionRoom';
import AuctionRegistration from './components/pages/AuctionRegistration/auctionregistartion';
import Dashboard from './components/pages/Dashboard/dashboard';
import AuctionConfigurations from './components/pages/AuctionConfigurations/AuctionConfigurations';


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (      
      <BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auction-room/:auction_id" element={<AuctionRoom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auction-registration" element={<AuctionRegistration />} />       
          <Route path="/dashboard" element={<Dashboard />} />                   
          <Route path="/auction-configurations/:auction_id" element={<AuctionConfigurations />} />   
        </Routes>
      </BrowserRouter>
  )
}

