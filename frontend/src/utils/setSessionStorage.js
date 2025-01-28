export default function setMapToSessionStorage(keyName, map) {
    if (map instanceof Map) {
      sessionStorage.setItem(keyName, JSON.stringify([...map]));
    } else {
      console.error("Provided value is not a Map");
    }
}