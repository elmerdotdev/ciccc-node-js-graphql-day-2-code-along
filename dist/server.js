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

  input CreateUserInput {
    firstname: String
    lastname: String
    email: String
  }

  input UpdateUserInput {
    id: ID!
    firstname: String
    lastname: String
    email: String
  }

  input DeleteUserInput {
    id: ID!
  }

  input CreateTodoInput {
    userId: ID!
    text: String!
  }

  input UpdateTodoInput {
    id: ID!
    text: String
    completed: Boolean
  }

  input DeleteTodoInput {
    id: ID!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
    updateUserById(data: UpdateUserInput!): User
    deleteUserById(data: DeleteUserInput!): String

    createTodo(data: CreateTodoInput!): Todo
    updateTodoById(data: UpdateTodoInput!): Todo
    deleteTodoById(data: DeleteTodoInput!): String
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
        createUser: (_, { data }) => {
            const newUser = {
                id: (0, uuid_1.v4)(),
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email
            };
            users.push(newUser);
            return newUser;
        },
        updateUserById: (_, { data }) => {
            const { id, firstname, lastname, email } = data;
            const foundIndex = users.findIndex(user => user.id === id);
            if (foundIndex === -1)
                return "User not found";
            users[foundIndex] = Object.assign(Object.assign({}, users[foundIndex]), { firstname: firstname !== null && firstname !== void 0 ? firstname : users[foundIndex].firstname, lastname: lastname !== null && lastname !== void 0 ? lastname : users[foundIndex].lastname, email: email !== null && email !== void 0 ? email : users[foundIndex].email });
            return users[foundIndex];
        },
        deleteUserById: (_, { data }) => {
            const foundIndex = users.findIndex(user => user.id === data.id);
            if (foundIndex === -1)
                return "User not found";
            users.splice(foundIndex, 1);
            return "User was deleted successfully";
        },
        createTodo: (_, { data }) => {
            const newTodo = {
                id: (0, uuid_1.v4)(),
                text: data.text,
                userId: data.userId,
                completed: false
            };
            todos.push(newTodo);
            return newTodo;
        },
        updateTodoById: (_, { data }) => {
            const { id, text, completed } = data;
            const foundIndex = todos.findIndex(todo => todo.id === id);
            if (foundIndex === -1)
                return "Todo not found";
            todos[foundIndex] = Object.assign(Object.assign({}, todos[foundIndex]), { text: text !== null && text !== void 0 ? text : todos[foundIndex].text, completed: completed !== null && completed !== void 0 ? completed : todos[foundIndex].completed });
            return todos[foundIndex];
        },
        deleteTodoById: (_, { data }) => {
            const foundIndex = todos.findIndex(todo => todo.id === data.id);
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
