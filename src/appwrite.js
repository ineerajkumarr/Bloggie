import { Client, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);
const database = new Databases(client);
const storage = new Storage(client);

export default client;
export { storage };

export const databases = database;
