const setupSocket = (io) => {
  io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Emit connection confirmation
      socket.emit("connected", "Connected to the room");

      // Handle "join_room" event
      socket.on("join_room", (props) => {
          const { auction_id } = props;

          if (!auction_id) {
              return socket.emit("error", "Auction ID is required to join a room");
          }

          socket.join(auction_id);
          console.log(`Socket ${socket.id} joined room: ${auction_id}`);

          // Emit confirmation to the client
          socket.emit("joined_room", `Joined room with auction ID: ${auction_id}`);
      });

      socket.on("refresh",()=>{
        socket.broadcast.emit("refresh");
      })

      // Handle disconnection
      socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.id}`);
      });
  });
};

module.exports = { setupSocket };
