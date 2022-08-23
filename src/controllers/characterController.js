import characterService from '../services/characterService.js'

const getAllCharacters = async (req, res) => {
  try {
    const response = await characterService.getAllCharacters()
    res.send(response)
  } catch (error) {
    console.error(error)
  }
}

const createNewCharacter = async (req, res) => {
  const { name, image, age, weight, history } = req.body
  const newCharacter = {
    name,
    image,
    age,
    weight,
    history,
  }

  try {
    const character = await characterService.createNewCharacter(newCharacter)
    res.status(201).send(character)
  } catch (error) {
    console.error(error)
  }
}

const updateCharacterMovie = async (req, res) => {
  const { characterId, movieId } = req.params

  if (!characterId) {
    return res.status(400).send('Character ID must be define')
  }

  if (!movieId) {
    return res.status(400).send('No valid movieId')
  }

  try {
    const res = await characterService.updateCharacterMovie(
      characterId,
      movieId,
    )
    return res
  } catch (error) {
    console.error(error)
  }
}

export default {
  getAllCharacters,
  createNewCharacter,
  updateCharacterMovie,
}
