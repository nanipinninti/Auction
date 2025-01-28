export default function getMapFromSessionStorage(keyName) {
  const storedValue = sessionStorage.getItem(keyName);
    if (storedValue) {
      try {
        return new Map(JSON.parse(storedValue));
      } catch (error) {
        console.error("Failed to parse the stored value:", error);
        return null;
      }
    } else {
      console.warn(`No value found in sessionStorage for key: ${keyName}`);
      return null;
    }
}