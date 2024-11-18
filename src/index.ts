import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT);
const API_URL = process.env.API_URL;

const typeDefs = `#graphql

    type Book {
        id: Int
        title: String
        synopsis: String
        author: String
        year: Int
    }

    type Query {
        getAllBooks: [Book]
    }

`;

const resolvers = {
    Query: {
        getAllBooks: async() => {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data;
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT},
});


console.log(`🚀  Server ready at: ${url}`);



