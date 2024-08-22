import { openConnection, closeConnection, executeNativeQuery } from '../../database/PostgreSQLNativeClient.js'
import { createTablePeopleQuery, createTablePetQuery, getPeoplesAndPetsQuery } from './Queries.js'

const person = (personName, petName, type) => { return { personName, pets: [pet(petName, type)]} }
const pet = ( petName, type) => { return { petName, type } }

const convertIntoModels = (rows) => {
    const persons = []

    if(!rows){
        return persons
    }

    rows.forEach(rawData => {
        const existingPerson = persons.findIndex(p => p.personName === rawData.person_name)
        if (existingPerson === -1) {
            persons.push(person(rawData.person_name, rawData.pet_name, rawData.pet_type))
        } else {
            persons[existingPerson].pets.push(pet(rawData.pet_name, rawData.pet_type))
        }
    })

    return persons
}

const initializeDatabase = async () => {
    try{
        await executeNativeQuery(createTablePeopleQuery)

        await executeNativeQuery(createTablePetQuery)
    }catch (error){
        console.log(error.message)
    }
}

const loadPersonsFromDatabase = async () => {
    try{
        const { rows } = await executeNativeQuery(getPeoplesAndPetsQuery)
    
        return convertIntoModels(rows)    
    }catch (error){
        console.log(error.message)
        return []
    }
}

const orquestrate = async () => {

    try{
        await openConnection()

        await initializeDatabase()

        return await loadPersonsFromDatabase()

    }catch (error){
        console.log(error.message)
    }finally{
        await closeConnection()
    }

    return []
}

export { orquestrate, initializeDatabase, loadPersonsFromDatabase }