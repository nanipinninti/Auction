const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors"); // Import CORS middleware
const connectDB = require("./db/connectDB");
const { setupSocket } = require("./socketServer");
const cookieParser = require("cookie-parser");
const path = require('path');
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin : "*"
  })
);

// Serve the folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for WebSocket
  },
});
setupSocket(io);

const adminAuthRouter = require("./routes/admin.auth.route");
app.use("/admin", adminAuthRouter);

const customerAuthRouter = require("./routes/customer.auth.route");
app.use("/customer", customerAuthRouter);

const auctionRouter = require("./routes/auction.route");
app.use("/auction", auctionRouter);

const homeApis = require("./routes/home");
app.use("/auctions", homeApis);

const playersRouter = require("./routes/players.route");
app.use("/players", playersRouter);

const franchiseAuthRouter = require("./routes/franchise.auth.route");
app.use("/franchise", franchiseAuthRouter);

const auctioneerAuthRouter = require("./routes/auctioneer.auth.route");
app.use("/auctioneer", auctioneerAuthRouter);

const auctionActions = require("./routes/auction.actions");
app.use("/auction-actions", auctionActions);

const auctionDetails = require("./routes/auction.details");
app.use("/auction-details", auctionDetails);

const dashboardRouter = require("./routes/dashboard.route");
app.use("/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Auction Backend");
});
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  connectDB();
  console.log("Port running on", PORT);
});
