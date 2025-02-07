require("dotenv").config();
const DOMAIN = `http://127.0.0.1:${process.env.PORT}`

const SendPlayer = async (auction_id) => {

    const api =  `${DOMAIN}/auto/auction-actions/send-player`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
        method : "auto"
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json()
        if (data.success){
            return {data,success : true}
        }else{
          return {success : false,code : "pick-set"}
        }
      } else {
        console.log("Failed to send the player",response);
      }
      return { success : false }
    } catch (error) {
      console.log("Servor error",error);
      return { success : false}
    }
  };


  const SoldPlayer = async (auction_id) => {
    const api = `${DOMAIN}/auto/auction-actions/sold-player`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
        method : "auto"
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json()
        return {success : true ,data}
      } else {
        console.log("Failed to sold the Player");
      }
      return { success : false,response}
    } catch (error) {
      console.log("Failed to sold the Player, Internal servor error");
      return { success : false,error}
    }
  };

  const UnSoldPlayer = async (auction_id) => {
    const api = `${DOMAIN}/auto/auction-actions/un-sold-player`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
        method : "auto"
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        return {success : true}
      } else {
        alert("Failed to Unsold the Players");
      }
      return { success : false}
    } catch (error) {
      alert("Failed to Un Sold the Player, Internal servor error");
      return { success : false}
    }
  };
 

  const PickSet = async (auction_id) => {
    const api =  `${DOMAIN}/auto/auction-actions/pick-set`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auction_id,
        method : "auto"
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {
        const data = await response.json()
        if (data.success){
          return { success : true}
        }
        else if(data.code === "end-auction") {
          return { success : false,code : "end-auction"}
        }
      } else {
        console.log("Failed to Pick the set, Try again");
      }
      return { success : false , response}
    } catch (error) {
      console.log("Servor Error while picking the set in " + auction_id);
      return { success : false ,error}
    }
  };

  const EndAuction = async (auction_id) => {
    const api =  `${DOMAIN}/auto/auction-actions/end-auction`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        auction_id,
        method : "auto"
      }),
    };
    try {
      const response = await fetch(api, options);
      if (response.ok) {  
        return {success : true}
      } else {
        console.log("Failed to end the Auction! :" + auction_id);
      }
      return {success : false,response}
    } catch (error) {
      console.log("Internal Servor Error to end the auction :"+auction_id);
      return {success : false,error}
    }
  };

module.exports = { SendPlayer, SoldPlayer, UnSoldPlayer, PickSet, EndAuction }