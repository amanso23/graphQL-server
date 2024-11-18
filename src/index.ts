import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { BookType } from "./types";

dotenv.config();

const PORT = parseInt(process.env.PORT);

const typeDefs = `#graphql

    type Book {
        title: String
        synopsis: String
        author: String
        year: Int
    }

    type Query {
        getAllBooks: [Book]
    }

`;

const books: BookType[] = [
    {
        "title": "To Kill a Mockingbird",
        "synopsis": "A young girl coming of age in the Deep South during the 1930s, witnessing the injustice of racism and prejudice.",
        "author": "Harper Lee",
        "year": 1960
    },
    {
        "title": "1984",
        "synopsis": "A dystopian novel set in a totalitarian society controlled by Big Brother, exploring themes of surveillance, censorship, and individuality.",
        "author": "George Orwell",
        "year": 1949
    }
];


const resolvers = {
    Query: {
        getAllBooks: () => books,
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



