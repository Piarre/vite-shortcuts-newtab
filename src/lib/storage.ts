import { v7 as uuid } from "uuid";

type StorageData = "shortcuts" | "categories";

const getData = <T>(key: StorageData): T[] => {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T[]) : [];
};

const saveData = <T extends { id?: string }>(key: StorageData, data: T) => {
  const existingData = JSON.parse(localStorage.getItem(key) || "[]") as T[];

  data.id = uuid();
  existingData.push(data);

  localStorage.setItem(key, JSON.stringify(existingData));
};

const deleteData = <T extends { id?: string }>(key: StorageData, id: string) => {
  const existingData = JSON.parse(localStorage.getItem(key) || "[]") as T[];

  const updatedData = existingData.filter((item) => item.id !== id);

  localStorage.setItem(key, JSON.stringify(updatedData));
};

const updateData = <T extends { id?: string }>(key: StorageData, updatedItem: T) => {
  const existingData = JSON.parse(localStorage.getItem(key) || "[]") as T[];
  const updatedData = existingData.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  localStorage.setItem(key, JSON.stringify(updatedData));
};

export { getData, saveData, deleteData, updateData };
