"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const uuid_1 = require("uuid");
let users = [
    { id: "1", firstname: "John", lastname: "Smith", email: "john@mail.com" },
    { id: "2", firstname: "Jane", lastname: "Doe", email: "jane@mail.com" },
    { id: "3", firstname: "Joe", lastname: "Moe", email: "joe@mail.com" },
];
let todos = [
    { id: "1", userId: "2", text: "Water garden", completed: false },
    { id: "2", userId: "1", text: "Mop floor", completed: true },
    { id: "3", userId: "2", text: "Clean dishes", completed: false },
    { id: "4", userId: "3", text: "Feed cat", completed: true },
    { id: "5", userId: "1", text: "Walk dog", completed: false }
];
// Type Definitions
const typeDefs = `#graphql
  type User {
    id: ID!,
    firstname: String,
    lastname: String,
    email: String,
    todos: [Todo]
  }

  type Todo {
    id: ID!,
    text: String,
    user: User,
    completed: Boolean
  }

  type Query {
    users: [User],
    todos: [Todo],
    getUserById(id: ID): User,
    getCompletedTodos: [Todo]
  }

  type Mutation {
    createUser(firstname: String, lastname: String, email: String): User
    updateUserById(id: ID, firstname: String, lastname: String, email: String): User
    deleteUserById(id: String): String

    createTodo(text: String, userId: String): Todo
    updateTodoById(id: ID, text: String, completed: Boolean): Todo
    deleteTodoById(id: String): String
  }
`;
// Resolvers
const resolvers = {
    Query: {
        users: () => users,
        todos: () => todos,
        getUserById: (_, { id }) => users.find(user => user.id == id),
        getCompletedTodos: () => todos.filter(todo => todo.completed === true)
    },
    Todo: {
        user: (parent) => users.find(user => user.id === parent.userId)
    },
    User: {
        todos: (parent) => todos.filter(todo => todo.userId === parent.id)
    },
    Mutation: {
        createUser: (_, { firstname, lastname, email }) => {
            const newUser = {
                id: (0, uuid_1.v4)(),
                firstname,
                lastname,
                email
            };
            users.push(newUser);
            return newUser;
        },
        updateUserById: (_, { id, firstname, lastname, email }) => {
            const user = users.find(user => user.id === id);
            if (!user)
                return "Todo not found";
            if (firstname)
                user.firstname = firstname;
            if (lastname)
                user.lastname = lastname;
            if (email)
                user.email = email;
            return user;
        },
        deleteUserById: (_, { id }) => {
            const foundIndex = users.findIndex(user => user.id === id);
            if (foundIndex === -1)
                return "User not found";
            users.splice(foundIndex, 1);
            return "User was deleted successfully";
        },
        createTodo: (_, { text, userId }) => {
            const newTodo = {
                id: (0, uuid_1.v4)(),
                userId,
                text,
                completed: false
            };
            todos.push(newTodo);
            return newTodo;
        },
        updateTodoById: (_, { id, text, completed }) => {
            const todo = todos.find(todo => todo.id === id);
            if (!todo)
                return "Todo not found";
            if (text)
                todo.text = text;
            if (completed)
                todo.completed = completed;
            return todo;
        },
        deleteTodoById: (_, { id }) => {
            const foundIndex = todos.findIndex(todo => todo.id === id);
            if (foundIndex === -1)
                return "Todo not found";
            todos.splice(foundIndex, 1);
            return "Todo was deleted successfully";
        }
    }
};
// Create Apollo Server
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers
});
// Start Apollo Server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = yield (0, standalone_1.startStandaloneServer)(server);
    console.log(`Server is running on ${url}...`);
});
startServer();
