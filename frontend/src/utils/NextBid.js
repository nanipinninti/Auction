export default function NextBid(currentBid) {

    const bid_ratio  = JSON.parse(sessionStorage.getItem('bid_ratio')) || { "0" : 1000000};
    // Convert keys of bid_ratio to numbers and sort in ascending order
    const thresholds = Object.keys(bid_ratio)
        .map((key) => parseInt(key, 10)) // Convert string keys to numbers
        .sort((a, b) => a - b);

    let increment = 0;

    // Find the largest threshold less than or equal to the current bid
    for (const threshold of thresholds) {
        if (currentBid >= threshold) {
            increment = bid_ratio[threshold.toString()]; // Use string keys to get the value
        } else {
            break;
        }
    }
    return currentBid + increment;
}

// Example usage:
console.log(NextBid(8000000));  // Output: 18000000 (80 Lakhs + 10 Lakhs)
console.log(NextBid(30000000)); // Output: 32000000 (3 Cr + 20 Lakhs)
console.log(NextBid(60000000)); // Output: 62500000 (6 Cr + 25 Lakhs)
