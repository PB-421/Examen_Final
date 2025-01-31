import { ApolloServer } from "@apollo/server"; //Pablo Borderas Andrés
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {MongoClient} from "mongodb"
import { restaurantModel } from "./types.ts";

const urlM = Deno.env.get("MONGO_URL")
if(!urlM){
    throw new Error("Mongo url not found")
}

//Mongo
const client = new MongoClient(urlM);
await client.connect();
console.log('Connected successfully to server');
const db = client.db("BBDDExamenFinal");
const restaurantCollection = db.collection<restaurantModel>("Restaurantes");

//GraphQL
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8080 }, context: async () => await ({restaurantCollection})
});

console.log(`Server running on: ${url}`);

