import characterRepository from '../database/respository/characterRepository.js'

const getAllCharacters = async () => {
  return await characterRepository.getAllCharacters()
}

const createNewCharacter = async (newCharacter) => {
  //!Validaciones de logica como verificar si el usuario esta o no!

  try {
    const res = await characterRepository.createNewCharacter(newCharacter)
    const { image, name } = res
    return { image, name }
  } catch (error) {
    console.error(error)
  }
}

const updateCharacterMovie = async (characterId, movieId) => {
  //!Validaciones de logica como verificar si el usuario esta o no!
  //!Validaciones de logica como verificar si la pelicula esta o no!

  try {
    const res = await characterRepository.updateCharacterMovie(
      characterId,
      movieId,
    )
  } catch (error) {
    console.error(error)
  }
}

export default {
  getAllCharacters,
  createNewCharacter,
  updateCharacterMovie,
}
