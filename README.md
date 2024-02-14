# bastyle-node-graphql-react

# React + Node.js with GraphQL Application

This interactive exercise represents a midterm practice session where you'll be developing two projects:

1. **Express GraphQL API:**
   - A server-side application built with Node.js and Express.
   - Utilizes MongoDB Cloud as the database for storing Student information.
   - Allows users to perform CRUD operations on Students using GraphQL.

2. **React Project:**
   - A client-side application built with React.
   - Consumes the GraphQL API developed in the Express server.

## Project Structure

Your project structure should look like this:


## Setup Instructions

Follow these steps to set up and run both projects:

### Express GraphQL API (server)

1. Navigate to the `server` folder:

    ```bash
    cd server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory and configure your MongoDB Cloud connection string:

    ```env
    DATABASE_URL=your-mongodb-cloud-connection-string
    ```

4. Start the server:

    ```bash
    npm start
    ```

   The GraphQL API should be accessible at `http://
