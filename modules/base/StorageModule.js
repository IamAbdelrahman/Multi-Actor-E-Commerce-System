export default class StorageManager {
  static SaveSection(section, value) {
    const data = StorageManager.Load("data") || {};
    data[section] = value;
    StorageManager.Save("data", data);
  }

  static LoadSection(section) {
    const data = StorageManager.Load("data") || {};
    return data[section] || [];
  }
  
  static Save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static Load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static Remove(key) {
    localStorage.removeItem(key);
  }
}
