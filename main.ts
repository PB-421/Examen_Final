import { ApolloServer } from "@apollo/server"; //Pablo Borderas Andrés
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {MongoClient} from "mongodb"

const urlM = Deno.env.get("MONGO_URL")
if(!urlM){
    throw new Error("Mongo url not found")
}

//Mongo
const client = new MongoClient(urlM);
await client.connect();
console.log('Connected successfully to server');
const db = client.db("BBDDExamenFinal");
const collection = db.collection("Prueba");

//GraphQL
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8080 }, context: async () => await ({collection})
});

console.log(`Server running on: ${url}`);

/* //API REST
async function handler(req: Request):Promise<Response> {
  const metodo = req.method
  const url = new URL(req.url)
  const path = url.pathname

  if(metodo === "GET"){
    if(path === "/test"){
      return new Response("Hola")
    }
  } else if(metodo === "POST"){
    await collection.insertOne({})
  } else if(metodo === "PUT"){

  } else if(metodo === "DELETE"){

  }
  return new Response("Method not found",{status: 404})
}

Deno.serve({port: 8080},handler)
*/