import { Sequelize } from 'sequelize'

let internalPool

const openConnection = async () => { 
  try{
    if(!internalPool){
      internalPool = new Sequelize(
        postgreSQLHost.database, 
        postgreSQLHost.user, 
        postgreSQLHost.password, 
        { host: postgreSQLHost.host, dialect: 'postgres'} 
      )

      await internalPool.authenticate()
    }
    
    console.log('Connection has been established successfully.')
  }catch (error){
    console.log(`Cannot connect to database. Detail: ${error.message}`)
  }
}

const closeConnection = async () => { 
  if(internalPool){
    await internalPool.close()
  }
}
  
const createTable = (tableName, tableDefinitions) => internalPool.define(tableName, tableDefinitions)

export { openConnection, closeConnection, createTable }