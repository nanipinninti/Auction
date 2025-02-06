const DOMAIN = import.meta.env.VITE_DOMAIN;

const modeNames = {
    customer: "customer",
    auctioneer: "auctioneer",
    franchise: "franchise",
};

const apiCall = async (api) => {
    const options = {
        method: "GET",
        credentials: "include", // Include cookies for authentication
    };

    try {
        const response = await fetch(api, options);

        if (response.ok) {
            const data = await response.json();
            // Return true or false based on the API response
            return data.success;
        }

        // If the response is not OK, return false
        return false;
    } catch (error) {
        console.error("API call failed:", error);
        return false;
    }
};

export default async function ModeCheck(auction_id) {
    const APIs = {
        customer: `${DOMAIN}/auth-verify/customer?auction_id=${auction_id}`,
        auctioneer: `${DOMAIN}/auth-verify/auctioneer?auction_id=${auction_id}`,
        franchise: `${DOMAIN}/auth-verify/franchise?auction_id=${auction_id}`,
    };

    try {
        // Check auctioneer mode first
        const isAuctioneer = await apiCall(APIs.auctioneer);
        if (isAuctioneer) {
            return modeNames.auctioneer;
        }

        // Check franchise mode next
        const isFranchise = await apiCall(APIs.franchise);
        if (isFranchise) {
            return modeNames.franchise;
        }

        // Default to customer mode
        return modeNames.customer;
    } catch (error) {
        console.error("Error in ModeCheck:", error);
        // Fallback to customer mode in case of any error
        return modeNames.customer;
    }
}