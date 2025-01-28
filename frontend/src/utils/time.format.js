export default function formatTimeToAmPm(time24) {
    // Split the input time into hours and minutes
    const [hours, minutes] = time24.split(":").map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Return the formatted time
    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Example Usage:
console.log(formatTimeToAmPm("13:45")); // Output: "1:45 PM"
console.log(formatTimeToAmPm("00:30")); // Output: "12:30 AM"
console.log(formatTimeToAmPm("12:00")); // Output: "12:00 PM"
console.log(formatTimeToAmPm("23:59")); // Output: "11:59 PM"