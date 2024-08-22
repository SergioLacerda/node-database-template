import { DataTypes } from 'sequelize'
import { createTable } from '../../database/PostgreSQLClient.js'

const createTables = async () => {
  try {
    
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

  } catch (error) {
    console.error('Error creating tables:', error)
  } 
}

export { createTables, Person, Pet }
