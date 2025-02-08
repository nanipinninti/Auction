const { Server } = require("socket.io");
const { SendPlayer, SoldPlayer, PickSet, EndAuction } = require("./socket/socket.auction.actions");

// Map to store active auctions and their timers
const activeAuctions = new Map();
// Setup Socket.IO
const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Emit connection confirmation
    socket.emit("connected", "Connected to the room");

    // Handle joining a room
    socket.on("join_room", (props) => {
      const { auction_id } = props;
      if (!auction_id) {
        return socket.emit("error", "Auction ID is required to join a room");
      }

      // If the auction is active, send the current end time
      if (activeAuctions.has(auction_id)) {
        const { end_time } = activeAuctions.get(auction_id);
        socket.emit("end_time", end_time);
      }

      // Join the room and store the auction ID
      socket.join(auction_id);
      socket.auction_id = auction_id;
      console.log(`----Socket ${socket.id} joined room: ${auction_id}`);
      socket.emit("joined_room", `Joined room with auction ID: ${auction_id}`);
    });

    // Handle starting the auction timer
    socket.on("start-timer", (auction_id) => {
      const end_time = startAuctionProcess(io, auction_id, 30);
      io.to(auction_id).emit("end_time", end_time);
    });

    // Socket event handler for reset
    socket.on("reset", (auction_id) => {
    console.log("Resetting auction:", auction_id);
    if (auction_id) {
      const end_time = resetAuctionTimer(io, auction_id);
      if (end_time) {
        io.to(auction_id).emit("end_time", end_time);
        io.to(auction_id).emit("refresh");
      } else {
        socket.emit("error", "Failed to reset the auction timer.");
      }
    }
    });


    // Handle refreshing the auction room
    socket.on("refresh", () => {
      if (socket.auction_id) {
        io.to(socket.auction_id).emit("refresh");
      }
    });

    // Handle stopping the auction timer
    socket.on("close-timer", (auction_id) => {
      stopAuction(auction_id);
      io.to(auction_id).emit("auction-stopped", "Auction has been stopped.");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const startAuctionProcess = (io, auction_id, duration = 30) => {
  const end_time = Math.floor(Date.now() / 1000) + duration;
  console.log(`Starting auction process for Auction ID: ${auction_id}, End Time: ${end_time}`);

  // Clear existing interval if the auction is already active
  if (activeAuctions.has(auction_id)) {
    clearInterval(activeAuctions.get(auction_id).interval);
  }

  // Set up the auction interval
  const auctionInterval = setInterval(async () => {
    try {
      // Attempt to sell the player
      const soldAPI = await SoldPlayer(auction_id);

      if (soldAPI.success) {
        io.to(auction_id).emit("player-sold-unsold", soldAPI.data);

        // Send the next player
        const response = await SendPlayer(auction_id);

        if (response.success) {
          // Successfully generated a new player
          io.to(auction_id).emit("refresh");
          const endTime = Math.floor(Date.now() / 1000) + duration;
          io.to(auction_id).emit("end_time", endTime);

          // Update the end time in activeAuctions
          if (activeAuctions.has(auction_id)) {
            activeAuctions.get(auction_id).end_time = endTime;
          }
        } else if (response.code && response.code === "pick-set") {
          // If players are empty in the current set, pick a new set
          const pick_set = await PickSet(auction_id);

          if (pick_set.success) {
            const send_new_player = await SendPlayer(auction_id);

            if (send_new_player.success) {
              io.to(auction_id).emit("refresh");
              const endTime = Math.floor(Date.now() / 1000) + duration;
              io.to(auction_id).emit("end_time", endTime);

              // Update the end time in activeAuctions
              if (activeAuctions.has(auction_id)) {
                activeAuctions.get(auction_id).end_time = endTime;
              }
            } else {
              console.log("Error while sending the player [after changing the set]");
              stopAuction(auction_id);
            }
          } else if (pick_set.code && pick_set.code === "end-auction") {
            // End the auction if all sets are completed
            const end_auction = await EndAuction(auction_id);

            if (end_auction.success) {
              stopAuction(auction_id);
              io.to(auction_id).emit("auction-completed");
              io.to(auction_id).emit("refresh");              
            } else {
              console.log("Error while ending the auction!!", end_auction);
              stopAuction(auction_id);
            }
          } else {
            console.log("Error while picking the set!!", pick_set);
            stopAuction(auction_id);
          }
        } else {
          console.log("Error while sending player", response);
          stopAuction(auction_id);
        }
      } else {
        console.log("Couldn't sell/unsell the player:", soldAPI);
        stopAuction(auction_id);
      }
    } catch (error) {
      console.error("Error in auction process:", error);
      stopAuction(auction_id);
    }
  }, duration * 1000);

  // Store the interval and end time in activeAuctions
  activeAuctions.set(auction_id, { interval: auctionInterval, end_time });
  console.log(`Auction ID ${auction_id} added to activeAuctions with End Time: ${end_time}`);
  return end_time;
};

const resetAuctionTimer = (io, auction_id) => {
  console.log("Resetting timer...");
  if (activeAuctions.has(auction_id)) {
    console.log(`Resetting timer for Auction ID: ${auction_id}`);
    clearInterval(activeAuctions.get(auction_id).interval); // Clear the existing interval
    activeAuctions.delete(auction_id); // Remove the auction from activeAuctions

    // Start a new timer and get the end_time
    const end_time = startAuctionProcess(io, auction_id, 30);
    console.log(`New End Time for Auction ID ${auction_id}: ${end_time}`);

    // Emit the new end_time to the room immediately
    io.to(auction_id).emit("end_time", end_time);
    return end_time;
  } else {
    console.log(`Auction ID ${auction_id} not found in active auctions.`);
    return null;
  }
};


// Function to stop the auction
const stopAuction = (auction_id) => {
  if (activeAuctions.has(auction_id)) {
    clearInterval(activeAuctions.get(auction_id).interval); // Clear the interval
    activeAuctions.delete(auction_id); // Remove the auction from activeAuctions
    console.log(`Auction ID ${auction_id} stopped and removed from active auctions.`);
  } else {
    console.log(`Auction ID ${auction_id} not found in active auctions.`);
  }
};

// Export the setupSocket function
module.exports = { setupSocket };