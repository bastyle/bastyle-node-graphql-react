require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')    
const cors = require("cors")

app.use(cors())
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
const Subscriber = require('./models/subscriber')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const SubscribeType = new GraphQLObjectType({
    name: 'Subscriber',
    description: 'This represents a subsriber to the app',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString)  },
      email: { type: GraphQLNonNull(GraphQLString) }
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      subscriber: {
        type: SubscribeType,
        description: 'A Single Subscriber',
        args: {
          _id: { type: GraphQLString }
        },
        resolve: async (parent, args) => {
            let subscriber
            subscriber = await Subscriber.findById(args._id)
           return subscriber;

        }
      },
      subscribers: {
        type: new GraphQLList(SubscribeType),
        description: 'List of All Subscribers',
        resolve: async () => {
           const subscribers = await Subscriber.find();
            return subscribers;         
        }
      }
    })
  })

  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addSubscriber: {
        type: SubscribeType,
        description: 'Add a Subscriber',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          email:{ type: GraphQLNonNull(GraphQLString) }
          
        },
        resolve: async (parent, args) => {
          const subscriber = new Subscriber({
            name: args.name,
            email: args.email
          });
          const newSubscriber = await subscriber.save();
          return newSubscriber;

        }
      }
    })
  })

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

app.use(express.json())
app.use('/subscribers', expressGraphQL({
schema: schema,
graphiql: true
}));


app.listen(5000, () => console.log('Server Started'))