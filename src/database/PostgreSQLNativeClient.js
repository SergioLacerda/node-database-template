import pg from 'pg'
import { postgreSQLHost } from '../../hosts.js'

let internalPool

const openConnection = async (host = postgreSQLHost) => {
  try {
    if(!internalPool){
      internalPool = new pg.Pool(host)

      await internalPool.connect()
    }

    console.log('Database connected.')
  } catch (error) {
    console.log(`Cannot connect to database. Detail: ${error.message}`)
  }
  
}

const closeConnection = async () => {
  if(internalPool){
    await internalPool.end()

    console.log('Database connection closed')
  }
}

const executeNativeQuery = async (query) => await internalPool.query(query)


export { openConnection, closeConnection, executeNativeQuery }

