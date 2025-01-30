const Auction = require("../models/auction.model")

function filterValidObjects(arr) {
    return arr.filter(obj => 
      !Object.values(obj).some(value => typeof value === 'string' && value.trim() === "")
    );
}
const addPlayers = async (req, res) => {

    // Bug, we have to remove empty spaces objects
    const { players, auction_id } = req.body; // Players and auction_id
    const customer_id = req.customer_id; // Authenticated customer's ID

    try {
        // Step 1: Find the auction by auction_id
        const auction = await Auction.findOne({ _id: auction_id });
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Step 2: Check if the customer_id matches the auction owner
        if (auction.customer_id.toString() !== customer_id) {
            return res.status(403).json({ message: "Invalid customer, this is not your auction" });
        }

        // Step 3: Process each player and their requested set
        const filteredEmptyFieldsOfPlayersData = filterValidObjects(players);
        if (filteredEmptyFieldsOfPlayersData.length !==0 ){
            for (let player of players) {
                const { set_no } = player;

                // Step 4: Find the set by set_no in the `sets` array
                let set = auction.sets.find((s) => s.set_no.toString() === set_no.toString());
                if (!set) {
                    throw new Error("Set doesn't existed")
                }
            }
        }
        if (filteredEmptyFieldsOfPlayersData.length ===0){
            auction.players = []
        }else{
            auction.players = [...players]
        }
        // Step 6: Save the updated auction document
        await auction.save();

        // Step 7: Send a success response
        res.status(201).json({
            message: "Players added successfully!",
            players : auction.players,
        });
    } catch (error) {
        console.error("Error during adding players:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getAllPlayerDetails  = async (req,res)=>{
    const {auction_id} = req.query
    try{
        const auction = await Auction.findOne({_id : auction_id})
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction does not exist",
            });
        }
        res.status(201).json({
            success : true,
            players : auction.players
        });

    }catch (error) {
        console.error("Error while getting Player info :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const GetPlayerDetails = async (req,res) =>{
    const {player_id,auction_id} = req.body
    try{
        const auction = await Auction.findOne({_id : auction_id})
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction does not exist",
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
        res.status(201).json({
            success : true,
            player
        });

    }catch (error) {
        console.error("Error while getting Player info :", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
module.exports = { addPlayers,GetPlayerDetails ,getAllPlayerDetails};

