export {}
const express = require('express')
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv')
const routes = require('./routes/userRoutes')
const sequelize = require('./database/sequelize')
const app = express()
dotenv.config()
const port = process.env.PORT
app.use(cors())
app.use(express.json())
app.use(routes)
const httpServer = http.createServer(app)


 

sequelize.authenticate()
.then(() => {
    sequelize.sync({force:true}).then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error:any) => {
    console.error('Error synchronizing database:', error);
  });
  console.log('Connection has been established successfully.');
})
.catch((error:any) => {
  console.error('Unable to connect to the database:', error);
})








httpServer.listen(port, ()=>{
    console.log(`Server Connected at http://localhost:${port}`);
})