import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { EndPoints } from "./consts/endpoints";

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
        getBookByAuthor(author: String): Book
    }

`;

const resolvers = {
    Query: {
        getAllBooks: async() => {
            const response = await fetch(`${API_URL}/${EndPoints.getBooks}`);
            const data = await response.json();
            return data;
        },
        getBookByAuthor: async(_, { author }) => {
            const response = await fetch(`${API_URL}/${EndPoints.getBooks}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: author,
                })
            });   
            const data = await response.json();
            return data;
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT},
});

console.log(`🚀  Server ready at: ${url}`);



