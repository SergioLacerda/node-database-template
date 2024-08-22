import { orquestrate, initializeDatabase, loadPersonsFromDatabase } from '../../src/service/native/PersonService.js'
import { createTablePeopleQuery, createTablePetQuery, getPeoplesAndPetsQuery } from '../../src/service/native/Queries.js'
import { executeNativeQuery, openConnection, closeConnection } from '../../src/database/PostgreSQLNativeClient.js'

jest.mock('../../src/database/PostgreSQLNativeClient.js')

describe('PersonService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call executeNativeQuery with the correct queries', async () => {
    await initializeDatabase()

    expect(executeNativeQuery).toHaveBeenCalledWith(createTablePeopleQuery)
    expect(executeNativeQuery).toHaveBeenCalledWith(createTablePetQuery)
  })

  it('should call executeNativeQuery with the correct query', async () => {
    await loadPersonsFromDatabase()

    expect(executeNativeQuery).toHaveBeenCalledWith(getPeoplesAndPetsQuery)
  })

  it('should return an empty array if there are no rows', async () => {
    executeNativeQuery.mockResolvedValue({ rows: [] })

    const persons = await loadPersonsFromDatabase()

    expect(persons).toEqual([])
  })

  it('validate orquestrate flow', async () => {
    await orquestrate()

    expect(openConnection).toHaveBeenCalledTimes(1)
    
    expect(executeNativeQuery).toHaveBeenCalledWith(createTablePeopleQuery)
    expect(executeNativeQuery).toHaveBeenCalledWith(createTablePetQuery)

    expect(executeNativeQuery).toHaveBeenCalledWith(getPeoplesAndPetsQuery)

    expect(closeConnection).toHaveBeenCalledTimes(1)
  })

  it('should return an array of persons with their pets', async () => {
    executeNativeQuery.mockResolvedValue({
      rows: [
        { person_name: 'John', pet_name: 'Max', pet_type: 'Dog' },
        { person_name: 'John', pet_name: 'Lucy', pet_type: 'Cat' },
        { person_name: 'Jane', pet_name: 'Buddy', pet_type: 'Dog' },
      ]
    })

    const persons = await loadPersonsFromDatabase()

    expect(persons).toEqual([
      { personName: 'John', pets: [{ petName: 'Max', type: 'Dog' }, { petName: 'Lucy', type: 'Cat' }] },
      { personName: 'Jane', pets: [{ petName: 'Buddy', type: 'Dog' }] },
    ])
  })

  it('should return an empty array if rows is null', async () => {
    executeNativeQuery.mockResolvedValue({ rows: null })

    const persons = await loadPersonsFromDatabase()

    expect(persons).toEqual([])
  })


  it('initializeDatabase should handle errors gracefully', async () => {
    executeNativeQuery.mockRejectedValueOnce(new Error('Database error'))

    await initializeDatabase()

    expect(executeNativeQuery).toHaveBeenCalledTimes(1)
  })

  it('loadPersonsFromDatabase should handle errors gracefully', async () => {
    executeNativeQuery.mockRejectedValue(new Error('Database error'))

    const persons = await loadPersonsFromDatabase()

    expect(persons).toEqual([])
  })

  it('orquestrate should handle errors gracefully', async () => {
    openConnection.mockRejectedValue(new Error('Database error'))

    const result = await orquestrate()

    expect(result).toEqual([])
  })

  
})
