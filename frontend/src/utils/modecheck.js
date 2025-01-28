import Cookies from "js-cookie"
const modeNames = {
    customer : "customer",
    auctioneer : "auctioneer",
    franchise : "franchise"
}

export default function ModeCheck(){
    if (Cookies.get("auctioneer_token")){
        return modeNames.auctioneer
    }
    else if (Cookies.get("franchise_token")){
        return modeNames.franchise
    }
    else{
        return modeNames.customer
    }
}