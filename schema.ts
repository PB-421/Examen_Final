

export const schema = `#graphql

    type Restaurant {
        id: ID!,
        nombre: String!,
        direccion: String!, #direccion, cuidad y pais, hacer split por comas 
        telefono: String!, #verificar
        temperatura: String!,
        hora: String!
    }

    type Query {
        getRestaurants(ciudad: String!): [Restaurant!]!
        getRestaurant(id: ID!): Restaurant
    }

    type Mutation {
        addRestaurant(nombre: String!,direccion: String!, ciudad: String!, telefono: String!): Restaurant!
        deleteRestaurant(id: ID!): Boolean!
    }
`