require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')    
const cors = require("cors")

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//app.use(cors())
app.use(express.json())

//import {graphqlHTTP} from 'express-graphql'
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const Student = require('./models/studentModel')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const StudentType = new GraphQLObjectType({
    name: 'Student',
    description: 'This represents a student to the app',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString)  },
      email: { type: GraphQLNonNull(GraphQLString) },
      major: { type: GraphQLNonNull(GraphQLString) },
      age: { type: GraphQLNonNull(GraphQLInt) },
      year: { type: GraphQLNonNull(GraphQLInt) }
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      student: {
        type: StudentType,
        description: 'A Single Student',
        args: {
          _id: { type: GraphQLString }
        },
        resolve: async (parent, args) => {
            let student
            student = await Student.findById(args._id)
           return student;

        }
      },
      students: {
        type: new GraphQLList(StudentType),
        description: 'List of All Students',
        resolve: async () => {
           const students = await Student.find();
            return students;         
        }
      }
    })
  })

  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addStudent: {
        type: StudentType,
        description: 'Add a student',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email:{ type: GraphQLNonNull(GraphQLString) },
          age:{ type: GraphQLNonNull(GraphQLInt) },
          major:{ type: GraphQLNonNull(GraphQLString) },
          year:{ type: GraphQLNonNull(GraphQLInt) }
          
        },
        resolve: async (parent, args) => {
          const student = new Student({
            name: args.name,
            email: args.email,
            major: args.major+" centennial",
            year: Number(args.year),
            age: Number(args.age)
          });
          const newStudent = await student.save();
          return newStudent;

        }
      },
      updateStudent: {
        type: StudentType,
        description: 'Update a student by ID',
        args: {
          _id: { type: GraphQLNonNull(GraphQLString) },
          name: { type: GraphQLNonNull(GraphQLString) },
          email:{ type: GraphQLNonNull(GraphQLString) },
          age:{ type: GraphQLNonNull(GraphQLInt) },
          major:{ type: GraphQLNonNull(GraphQLString) },
          year:{ type: GraphQLNonNull(GraphQLInt) }
        },
        //resolve: async (parent, { _id, input }) => {
          resolve: async (parent, args) => {
          console.log("updating...."+JSON.stringify(args))
          const updatedStudent = await Student.findByIdAndUpdate(args._id, {
            name: args.name,
            email: args.email,
            major: args.major,
            year: args.year,
            age: args.age,
          }, { new: true });
  
          return updatedStudent;
        },
      },
      deleteStudent: {
        type: StudentType,
        description: 'Delete a student by ID',
        args: {
          _id: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, { _id }) => {
          const deletedStudent = await Student.findByIdAndDelete(_id);
          return deletedStudent;
        },
      },
    })
  })

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

app.use(express.json())
app.use('/students', expressGraphQL({
  schema: schema,
  graphiql: true
}));


app.listen(5000, () => console.log('Server Started'))