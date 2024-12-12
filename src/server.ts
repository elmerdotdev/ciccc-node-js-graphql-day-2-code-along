import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid'

// Sample dataset
let students = [
  { id: "1", fullname: "John Smith" },
  { id: "2", fullname: "Jane Doe" },
  { id: "3", fullname: "Charlie Chaplin" },
  { id: "4", fullname: "Joe Moe" },
  { id: "5", fullname: "Jack Daniels" }
]

let courses = [
  { id: "1", courseName: "WAD" },
  { id: "2", courseName: "UI/UX" },
  { id: "3", courseName: "Digital Marketing" }
]

let enrolments = [
  { id: "1", studentId: "1", courseId: "3" },
  { id: "2", studentId: "2", courseId: "1" },
  { id: "3", studentId: "3", courseId: "1" },
  { id: "4", studentId: "4", courseId: "2" },
  { id: "5", studentId: "5", courseId: "3" }
]

// Type Definitions
const typeDefs = `#graphql
  type Student {
    id: ID!,
    fullname: String,
    courses: [Course]
  }

  type Course {
    id: ID!,
    courseName: String,
    students: [Student]
  }

  type Enrolment {
    id: ID!,
    student: Student,
    course: Course
  }

  type Query {
    students: [Student],
    courses: [Course],
    enrolments: [Enrolment]
  }
`

// Resolvers
const resolvers = {
  Query: {
    students: () => students,
    courses: () => courses,
    enrolments: () => enrolments
  },
  Student: {
    courses: (parent: { id: String }) =>
      enrolments
        .filter(enrolment => enrolment.studentId === parent.id)
        .map(enrolment => courses.find(course => course.id === enrolment.courseId))
  },
  Course: {
    students: (parent: { id: String }) =>
      enrolments
        .filter(enrolment => enrolment.courseId === parent.id)
        .map(enrolment => students.find(student => student.id === enrolment.studentId))
  },
  Enrolment: {
    student: (parent: { studentId: string }) =>
      students.find(student => student.id === parent.studentId),
    course: (parent: { courseId: string }) =>
      courses.find(course => course.id === parent.courseId),
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