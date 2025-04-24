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
// Sample dataset
let students = [
    { id: "1", fullname: "John Smith" },
    { id: "2", fullname: "Jane Doe" },
    { id: "3", fullname: "Charlie Chaplin" },
    { id: "4", fullname: "Joe Moe" },
    { id: "5", fullname: "Jack Daniels" }
];
let courses = [
    { id: "1", courseName: "WAD" },
    { id: "2", courseName: "UI/UX" },
    { id: "3", courseName: "Digital Marketing" }
];
let enrolments = [
    { id: "1", studentId: "1", courseId: "3" },
    { id: "2", studentId: "2", courseId: "1" },
    { id: "3", studentId: "3", courseId: "1" },
    { id: "4", studentId: "4", courseId: "2" },
    { id: "5", studentId: "5", courseId: "3" }
];
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
`;
// Resolvers
const resolvers = {
    Query: {
        students: () => students,
        courses: () => courses,
        enrolments: () => enrolments
    },
    Student: {
        courses: (parent) => enrolments
            .filter(enrolment => enrolment.studentId === parent.id)
            .map(enrolment => courses.find(course => course.id === enrolment.courseId))
    },
    Course: {
        students: (parent) => enrolments
            .filter(enrolment => enrolment.courseId === parent.id)
            .map(enrolment => students.find(student => student.id === enrolment.studentId))
    },
    Enrolment: {
        student: (parent) => students.find(student => student.id === parent.studentId),
        course: (parent) => courses.find(course => course.id === parent.courseId),
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
