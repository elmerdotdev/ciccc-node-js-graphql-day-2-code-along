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

  type Mutation {
    createUser(firstname: String, lastname: String, email: String): User
    updateUserById(id: ID, firstname: String, lastname: String, email: String): User
    deleteUserById(id: String): String

    createTodo(text: String, userId: String): Todo
    updateTodoById(id: ID, text: String, completed: Boolean): Todo
    deleteTodoById(id: String): String
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
    createUser: (_: unknown, { firstname, lastname, email }: Omit<User, 'id'>) => {
      const newUser = {
        id: uuidv4(),
        firstname,
        lastname,
        email
      }
      users.push(newUser)
      return newUser
    },
    updateUserById: (_: unknown, { id, firstname, lastname, email }: Partial<User>): User | string => {
      const user = users.find(user => user.id === id)
      if (!user) return "Todo not found"
      if (firstname) user.firstname = firstname
      if (lastname) user.lastname = lastname
      if (email) user.email = email
      return user
    },
    deleteUserById: (_: unknown, { id }: { id: string }) => {
      const foundIndex = users.findIndex(user => user.id === id)
      if (foundIndex === -1) return "User not found"
      users.splice(foundIndex, 1)
      return "User was deleted successfully"
    },
    createTodo: (_: unknown, { text, userId }: Todo) => {
      const newTodo = {
        id: uuidv4(),
        userId,
        text,
        completed: false
      }
      todos.push(newTodo)
      return newTodo
    },
    updateTodoById: (_: unknown, { id, text, completed }: Partial<Todo>): Todo | string => {
      const todo = todos.find(todo => todo.id === id)
      if (!todo) return "Todo not found"
      if (text) todo.text = text
      if (completed) todo.completed = completed
      return todo
    },
    deleteTodoById: (_: unknown, { id }: { id: string }) => {
      const foundIndex = todos.findIndex(todo => todo.id === id)
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