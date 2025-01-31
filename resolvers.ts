import { Collection } from "mongodb";
import { restaurantModel } from "./types.ts";
import { GraphQLError } from "graphql";
import { conseguirHora, conseguirTemperatura, geolocalizar, verificarTelefono } from "./apiFunctions.ts";

type Context = {
    restaurantCollection: Collection<restaurantModel>
}

export const resolvers = {
    Mutation: {
        addRestaurant: async (_:unknown,args: {nombre: string, direccion: string, ciudad: string, telefono: string},context: Context):Promise<restaurantModel> => {
            const telefonoEncontrado = await context.restaurantCollection.findOne({telefono: args.telefono})
            if(telefonoEncontrado) throw new GraphQLError("El telefono ya esta en uso")
            const countrySpecs = await verificarTelefono(args.telefono)
            if(!countrySpecs.is_valid) throw new GraphQLError("Telefono invalido")
            const {insertedId} = await context.restaurantCollection.insertOne({
                nombre: args.nombre,
                direccion: args.direccion,
                ciudad: args.ciudad,
                pais: countrySpecs.country,
                telefono: args.telefono,
                timezone: countrySpecs.timezone
            })
            return {
                _id: insertedId,
                nombre: args.nombre,
                direccion: args.direccion,
                ciudad: args.ciudad,
                pais: countrySpecs.country,
                telefono: args.telefono,
                timezone: countrySpecs.timezone
            }
        }
    },
    Restaurant: {
        id: (parent: restaurantModel,_:unknown,__:unknown):string => {
            return parent._id!.toString()
        },
        direccion: (parent: restaurantModel,_:unknown,__:unknown):string => {
            return parent.direccion + ", " + parent.ciudad + ", "+ parent.pais 
        },
        temperatura: async (parent: restaurantModel,_:unknown,__:unknown):Promise<string> => {
            const localizacion = await geolocalizar(parent.ciudad,parent.pais)
            return await conseguirTemperatura(localizacion[0],localizacion[1])
        },
        hora: async (parent: restaurantModel,_:unknown,__:unknown):Promise<string> => {
            return await conseguirHora(parent.timezone)
        }
    }
}