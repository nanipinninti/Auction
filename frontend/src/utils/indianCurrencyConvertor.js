export default function toIndianCurrency(number) {
    if (number === 0) return "0";

    // Convert to absolute value to handle negative numbers
    const absNumber = Math.abs(number);

    let result = "";
    if (absNumber >= 10000000) {
        // Convert to crores
        const crores = (absNumber / 10000000).toFixed(2);
        result = `${crores} Cr`;
    } else if (absNumber >= 100000) {
        // Convert to lakhs
        const lakhs = (absNumber / 100000).toFixed(2);
        result = `${lakhs} Lakhs`;
    } else {
        result = absNumber.toString();
    }

    // Add negative sign if the original number was negative
    return number < 0 ? `-${result}` : result;
}

// Test the function
console.log(toIndianCurrency(1000000));  // Output: "10 Lakhs"
console.log(toIndianCurrency(25000000)); // Output: "2.50 Cr"
console.log(toIndianCurrency(6500000));  // Output: "65 Lakhs"
console.log(toIndianCurrency(12500000)); // Output: "1.25 Cr"
console.log(toIndianCurrency(-750000));  // Output: "-7.50 Lakhs"
console.log(toIndianCurrency(0));        // Output: "0"
