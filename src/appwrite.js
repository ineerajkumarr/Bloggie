import { Client, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66758f0e001c46051019");
const database = new Databases(client);
const storage = new Storage(client);

export default client;
export { storage };

export const databases = database;
