import characterService from '../services/characterService.js'

const getAllCharacters = async (req, res) => {
  try {
    const character = await characterService.getAllCharacters()
    res.send(character)
  } catch (error) {
    res.status(error.statusCode).send(error.errMsg())
  }
}

const getOneCharacter = async (req, res) => {
  const { characterId } = req.params

  try {
    const character = await characterService.getOneCharacter(characterId)
    res.send(character)
  } catch (error) {
    res.status(error.statusCode).send({
      errors: error.errMsg(),
    })
  }
}

const createNewCharacter = async (req, res) => {
  const { name, image, age, weight, history, movies = null } = req.body
  const newCharacter = {
    name,
    image,
    age,
    weight,
    history,
    movies,
  }

  try {
    const character = await characterService.createNewCharacter(newCharacter)
    res.status(201).send(character)
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

const updateCharacter = async (req, res) => {
  const { characterId } = req.params
  const updatedCharacter = req.body

  try {
    const res = await characterService.updateCharacter(
      characterId,
      updatedCharacter,
    )
    return res
  } catch (error) {
    res.status(error.statusCode).send({ errors: error.errMsg() })
  }
}

//! En la creacion, puedo hacer que sea opcional el paso de parametros de las peliculas donde esta. Revisar si todas estas peliculas estan en la base de datos y si estan, hacer la asociacion y si no, devolver un 400 diciendo que una o mas no se encontraron y por ende, no se puede llevar el proceso de asociarlas.
//? Asi puedo crear peliculas donde meta de una personas o visceversa y para actualizar de hecho puedo enviar en el cuerpo de la request los ids en un array para agregar este pj o pelicula a su respectivo par!
//* Esto definitivamente es mejor que por parametros.

export default {
  getAllCharacters,
  createNewCharacter,
  updateCharacter,
  getOneCharacter,
}
