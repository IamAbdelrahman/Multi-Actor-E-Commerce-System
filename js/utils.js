import StorageManager from './storageManager.js';
async function StoreJSON() {
  if (!localStorage.getItem("data")) {
    fetch('./data/data.json')
      .then(response => response.json())
      .then(data => {
        StorageManager.Save('data', data);
        console.log("JSON data loaded to localStorage for the first time.");
      })
      .catch(err => console.error("Failed to load JSON:", err));
  } else {
    console.log("Data already in localStorage. Skipping JSON fetch.");
  }
}
