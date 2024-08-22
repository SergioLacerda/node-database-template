import { openConnection, closeConnection, createTable } from '../../database/PostgreSQLClient.js'

const convertIntoModels = (persons) => {
  return persons.map(person => ({
    personName: person.personName,
    pets: person.Pets.map(pet => ({
      petName: pet.petName,
      type: pet.type
    }))
  }))
}

const orquestrate = async () => {

  try{
      await openConnection()

      const Person = createTable('Person', {
        personName: {
          type: DataTypes.STRING,
          primaryKey: true
        }
      })
    
      const Pet = createTable('Pet', {
        petName: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        type: {
          type: DataTypes.STRING
        },
        personName: {
          type: DataTypes.STRING,
          references: {
            model: Person,
            key: 'personName'
          }
        }
      })

      Person.hasMany(Pet, { foreignKey: 'personName' })
      Pet.belongsTo(Person, { foreignKey: 'personName' })

      await Person.sync()
      await Pet.sync()

    console.log('Tables created successfully!')

    const persons = await Person.findAll({ include: { model: Pet, attributes: ['petName', 'type']} })

    return convertIntoModels(persons)
  } catch (error) {
    console.error('Error creating tables:', error.message)
  } finally{
    await closeConnection()
  }

  return []
}

export { orquestrate }