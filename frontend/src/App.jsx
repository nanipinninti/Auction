import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/pages/Home/home';
import Login from './components/pages/Login/login';
import AuctionRoom from './components/pages/AuctionRoom/AuctionRoom';
import AuctionRegistration from './components/pages/AuctionRegistration/auctionregistartion';
import Dashboard from './components/pages/Dashboard/dashboard';
import AuctionConfigurations from './components/pages/AuctionConfigurations/AuctionConfigurations';

export default function App() {
  return (      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auction-room/:auction_id" element={<AuctionRoom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auction-registration" element={<AuctionRegistration />} />       
          <Route path="/dashboard" element={<Dashboard />} />                   
          <Route path="/aution-configurations/:auction_id" element={<AuctionConfigurations />} />   
        </Routes>
      </BrowserRouter>
  )
}

