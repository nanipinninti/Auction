const express = require("express");
const Auction = require("../models/auction.model");
const { mongoose } = require("mongoose");

const GetSets = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    const auction = await Auction.findOne({ _id: auction_id }).select("sets");
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    return res.status(201).json({
      success: true,
      sets: auction.sets,
    });
  } catch (error) {
    console.log("Error while getting sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};



// Hasn't writed code here yet
const PurseLeft = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    const auction = await Auction.findOne({ _id: auction_id }).select("franchises");
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    return res.status(201).json({
      success: true,
      franchises: auction.franchises,
    });
  } catch (error) {
    console.log("Error while getting sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
}

const RemainingSets = async (req, res) => {
  const { auction_id } = req.query;
  console.log(auction_id)
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }

  try {
    // Find the auction by ID and select the necessary fields
    const auction = await Auction.findOne({ _id: auction_id }).select(
      "sets players"
    );

    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't exist",
      });
    }

    // Extract sets and players from the auction
    const { sets, players } = auction;

    // Create a result array to store the status of each set
    const setStatus = [];

    // Iterate through each set
    for (const set of sets) {
      const { set_no, set_name } = set;

      // Check if any player in this set is still available
      const hasAvailablePlayer = players.some(
        (player) => player.set_no === set_no && player.status === "Available"
      );

      // Determine the status of the set
      const status = hasAvailablePlayer ? "Available" : "Completed";

      // Add the set status to the result array
      setStatus.push({
        set_no,
        set_name,
        status,
      });
    }

    return res.status(201).json({
      success: true,
      sets: setStatus,
    });
  } catch (error) {
    console.log("Error while getting remaining sets: ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const PlayersInSet = async (req,res)=>{
  const { auction_id, set_no } = req.query;
  if (!auction_id || !set_no) {
    return res.status(401).json({
      success: false,
      message: "Auction Id and Set No is required",
    });
  }

  try{
    const auction = await Auction.findOne({ _id: auction_id }).select("sets players");
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }

    const players_info = auction.players.filter(
      (player) => player.set_no == set_no
    ).map((player) => {
      return {
        player_name: player.player_name,
        base_price: player.base_price,
        sold_price: player.sold_price,
        status: player.status,
      };
    } );

    return res.status(201).json({
      success: true,
      players_info
    });
  }catch(error){
    console.log("Error while getting sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }

}

const FranchiseStatus = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }

  try {
    // Find the auction by ID and select the necessary fields
    const auction = await Auction.findOne({ _id: auction_id }).select(
      "franchises players"
    );

    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't exist",
      });
    }

    const franchise_status = {};

    // Iterate through each franchise and calculate remaining purse and players bought
    for (const franchise of auction.franchises) {
      const { franchise_id, players, total_purse, spent } = franchise;
      const players_bought = players.length;
      const remaining_purse = total_purse - spent;
      const players_bought_list = players.map((player_id) => {
        const player = auction.players.find(
          (player) => player._id.toString() === player_id.toString()
        );
        return {
          player_name: player.player_name,
          base_price: player.base_price,
          sold_price: player.sold_price,
          set_no: player.set_no,
        };
      });

      franchise_status[franchise_id] = {
        remaining_purse,
        players_bought,
        players_bought_list
      };
    }

    return res.status(201).json({
      success: true,
      franchise_status,
    });
  } catch (error) {
    console.log("Error while getting remaining sets: ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const PlayerDetails = async (req, res) => {
  const { player_id, auction_id } = req.query;
  if (!player_id || !auction_id) {
    return res.status(401).json({
      success: false,
      message: "Player Id is required",
    });
  }
  try {
    const auction = await Auction.findOne({ _id: auction_id });
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction or Player doesn't existed",
      });
    }

    const player = auction.players.find(
      (player) => player._id.toString() === player_id
    );
    if (!player) {
      return res
        .status(403)
        .json({ message: "Player is not registered in this Auction!" });
    }

    return res.status(201).json({
      success: true,
      player_details: player,
    });
  } catch (error) {
    console.log("Error while getting sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const SoldPlayers = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    // const object_id = new mongoose.Types.ObjectId(auction_id)
    // console.log(object_id,auction_id)
    const auction = await Auction.findOne({ _id: auction_id });
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    const sold_players = auction.players
      .filter((player) => player.status === "Sold")
      .map((player) => {
        // Find the franchise that contains this player's ID exactly
        const franchise = auction.franchises.find((franchise) =>
          franchise.players.some(
            (playerId) => playerId.toString() === player._id.toString()
          )
        );

        // Get the franchise name (if franchise is found)
        const franchise_id = franchise
          ? franchise.franchise_id
          : "Unknown Franchise";
        return {
          player_name: player.player_name,
          base_price: player.base_price,
          sold_price: player.sold_price,
          franchise_id: franchise_id
        };
      });

    return res.status(201).json({
      success: true,
      sold_players,
    });
  } catch (error) {
    console.log("Error while getting sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const CurrentStatus = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    const auction = await Auction.findOne({ _id: auction_id });
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    return res.status(201).json({
      success: true,
      auction_name : auction.auction_name,
      current_status: auction.status,
      auction_details: auction.auction_details,
      bid_ratio: auction.bid_ratio,
    });
  } catch (error) {
    console.log("Error to get Status : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const UnSoldPlayers = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    // const object_id = new mongoose.Types.ObjectId(auction_id)
    // console.log(object_id,auction_id)
    const auction = await Auction.findOne({ _id: auction_id });
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    const un_sold_players = auction.players.filter(
      (player) => player.status === "Unsold"
    );
    return res.status(201).json({
      success: true,
      un_sold_players,
    });
  } catch (error) {
    console.log("Error while getting un-sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const TopBuys = async (req, res) => {
  const { auction_id } = req.query;
  if (!auction_id) {
    return res.status(401).json({
      success: false,
      message: "Auction Id is required",
    });
  }
  try {
    // const object_id = new mongoose.Types.ObjectId(auction_id)
    // console.log(object_id,auction_id)
    const auction = await Auction.findOne({ _id: auction_id });
    if (!auction) {
      return res.status(401).json({
        success: false,
        message: "Auction doesn't existed",
      });
    }
    const top_buys = auction.players
      .filter((player) => player.status === "Sold")
      .sort((a, b) => b.sold_price - a.sold_price);
    return res.status(201).json({
      success: true,
      top_buys,
    });
  } catch (error) {
    console.log("Error while getting un-sold player list : ", error);
    res.status(501).json({
      success: false,
      error: error.message,
    });
  }
};

const AvailablePlayers = async (req, res) => {
    const { auction_id } = req.query;
  
    if (!auction_id) {
      return res.status(400).json({
        success: false,
        message: "Auction ID is required",
      });
    }
  
    try {
      // Find the auction by ID
      const auction = await Auction.findOne({ _id: auction_id }).select("players");
  
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: "Auction not found",
        });
      }
  
      // Filter available players and map to required fields
      const availablePlayers = auction.players
        .filter((player) => player.status === "Available")
        .map((player) => ({
          player_name: player.player_name,
          base_price: player.base_price,
          set_no: player.set_no,
        }));
  
      return res.status(200).json({
        success: true,
        availablePlayers,
      });
    } catch (error) {
      console.error("Error while fetching available players:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };


module.exports = {
  SoldPlayers,
  UnSoldPlayers,
  TopBuys,
  CurrentStatus,
  GetSets,
  PlayerDetails,
  RemainingSets,
  AvailablePlayers,
  FranchiseStatus,
  PlayersInSet
};
