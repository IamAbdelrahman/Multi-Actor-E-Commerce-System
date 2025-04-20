export default class StorageManager {
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
