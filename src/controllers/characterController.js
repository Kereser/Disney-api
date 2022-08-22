import characterService from '../services/characterService.js'

const getAll = async (req, res) => {
  const response = await characterService.getAll()
  res.send(response)
}

export default {
  getAll,
}
