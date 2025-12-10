import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid'

// Sample dataset
type User = {
  id: string,
  firstname: string,
  lastname: string,
  email: string
}

type Todo = {
  id: string,
  userId: string,
  text: string,
  completed: boolean
}

let users: User[] = [
  { id: "1", firstname: "John", lastname: "Smith", email: "john@mail.com" },
  { id: "2", firstname: "Jane", lastname: "Doe", email: "jane@mail.com" },
  { id: "3", firstname: "Joe", lastname: "Moe", email: "joe@mail.com" },
]

let todos: Todo[] = [
  { id: "1", userId: "2", text: "Water garden", completed: false },
  { id: "2", userId: "1", text: "Mop floor", completed: true },
  { id: "3", userId: "2", text: "Clean dishes", completed: false },
  { id: "4", userId: "3", text: "Feed cat", completed: true },
  { id: "5", userId: "1", text: "Walk dog", completed: false }
]

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
`

// Resolvers
const resolvers = {
  Query: {
    users: () => users,
    todos: () => todos,
    getUserById: (_: unknown, { id } : { id: string }) =>
      users.find(user => user.id == id),
    getCompletedTodos: () =>
      todos.filter(todo => todo.completed === true)
  },
  Todo: {
    user: (parent: { userId: string }) =>
      users.find(user => user.id === parent.userId)
  },
  User: {
    todos: (parent: { id: string }) =>
      todos.filter(todo => todo.userId === parent.id)
  },
  Mutation: {
    createUser: (_: unknown, { data }: { data: Omit<User, 'id'> }) => {
      const newUser = {
        id: uuidv4(),
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email
      }
      users.push(newUser)
      return newUser
    },
    updateUserById: (_: unknown, { data }: { data: Partial<User> & { id: string } }): User | string => {
      const { id, firstname, lastname, email } = data
      const foundIndex = users.findIndex(user => user.id === id)
      if (foundIndex === -1) return "User not found"

      users[foundIndex] = {
        ...users[foundIndex],
        firstname: firstname ?? users[foundIndex].firstname,
        lastname: lastname ?? users[foundIndex].lastname,
        email: email ?? users[foundIndex].email
      }
      return users[foundIndex]
    },
    deleteUserById: (_: unknown, { data }: { data: { id: string } }) => {
      const foundIndex = users.findIndex(user => user.id === data.id)
      if (foundIndex === -1) return "User not found"
      users.splice(foundIndex, 1)
      return "User was deleted successfully"
    },

    createTodo: (_: unknown, { data }: { data: Omit<Todo, 'id' | 'completed'> }) => {
      const newTodo: Todo = {
        id: uuidv4(),
        text: data.text!,
        userId: data.userId!,
        completed: false
      }
      todos.push(newTodo)
      return newTodo
    },

    updateTodoById: (_: unknown, { data }: { data: Partial<Todo> & { id: string } }): Todo | string => {
      const { id, text, completed } = data
      const foundIndex = todos.findIndex(todo => todo.id === id)
      if (foundIndex === -1) return "Todo not found"

      todos[foundIndex] = {
        ...todos[foundIndex],
        text: text ?? todos[foundIndex].text,
        completed: completed ?? todos[foundIndex].completed
      }
      return todos[foundIndex]
    },

    deleteTodoById: (_: unknown, { data }: { data: { id: string } }) => {
      const foundIndex = todos.findIndex(todo => todo.id === data.id)
      if (foundIndex === -1) return "Todo not found"
      todos.splice(foundIndex, 1)
      return "Todo was deleted successfully"
    }
  }
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}...`)
}

startServer()