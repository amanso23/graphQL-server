import { ApolloServer } from "@apollo/server";
import { GraphQLError } from "graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { EndPoints } from "./consts/endpoints";
import { BookType, ErrorData } from "./types/types";

dotenv.config();

const PORT = parseInt(process.env.PORT);
const API_URL = process.env.API_URL;

const typeDefs = `#graphql

    type Book {
        id: Int
        title: String!
        synopsis: String
        author: String!
        year: Int!
    }

    type Query {
        getAllBooks: [Book]
        getBooksByAuthor(author: String): [Book]
    }

    type Mutation {
        saveBook(
            title: String!
            synopsis: String
            author: String!
            year: Int!
        ): Book
    }
`;

const resolvers = {
    Query: {
        getAllBooks: async() => {
            try{
                const response = await fetch(`${API_URL}/${EndPoints.books}`);
                const data = await response.json();
                return data;
            }catch(err){
                throw err;
            }
        },
        getBooksByAuthor: async(_: any, { author }: {author: string}) => {
            try{
                const response = await fetch(`${API_URL}/${EndPoints.search}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        author: author,
                    })
                });   

                if(!response.ok){
                    const errorData = await response.json();
                    throw new GraphQLError('The GraphQL operation includes an invalid value for a field argument.', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            errorData: errorData,
                        },
                    });
                };

                const data = await response.json();
                return data;
            }catch(err){
                throw err;
            }
        }
    },
    
    Mutation: {
        saveBook: async(_: any, {title, synopsis, author, year}: BookType) => {
            try{
                const response = await fetch(`${API_URL}/${EndPoints.books}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        synopsis: synopsis,
                        author: author, 
                        year: year,
                    }),
                });

                if(!response.ok){
                    const errorData = await response.json();
                    throw new GraphQLError("The GraphQL operation is not valid against the server's schema.", {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                            errorData: errorData,
                        },
                    });
                };
                
                const data = await response.json();
                return data;
            }catch(err){
                throw err;
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT},
});

console.log(`🚀  Server ready at: ${url}`);



