export default function formatDateToReadable(dateString) {
    // Create a Date object from the ISO string
    const date = new Date(dateString);

    // Get day, month, and year
    const day = date.getDate(); // Day of the month
    const month = date.toLocaleString("default", { month: "long" }); // Month name
    const year = date.getFullYear(); // Full year

    // Combine in the desired format
    return `${day} ${month} ${year}`;
    }

    // Example Usage:
const isoDate = "2025-06-25T00:00:00.000Z";
console.log(formatDateToReadable(isoDate)); // Output: "25 June 2025"
