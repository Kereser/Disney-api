const MOVIEMODEL = 'Movie'
const CHARACTERMODEL = 'Character'
const GENREMODEL = 'Genre'
const NEWCHARACTER = {
  name: 'Juanito perez',
  age: 23,
  weight: 234.5,
  history: 'La historia de juanito aun esta por ser contada.',
  image: 'juanito.jpg',
}
const NEWCHARACTER2 = {
  name: 'John doe',
  age: 44,
  weight: 25.3,
  history: 'La historia de john aun esta por ser contada.',
  image: 'john.jpg',
}
const NEWMOVIE = {
  image: 'interestellar.jpg',
  title: 'interestellar',
  calification: 9,
  creationDate: '2019-05-12',
}

const NEWMOVIE2 = {
  image: 'El_Padrino.jpg',
  title: 'El Padrino',
  calification: 9.2,
  creationDate: '1999-03-12',
}

const NEWMOVIE3 = {
  image: 'El_Padrino_2.jpg',
  title: 'El Padrino 2',
  calification: 9.2,
  creationDate: '1999-03-12',
}

const NONVALIDCHARACTER = {
  name: 'Juanito perez',
  age: 23,
  weight: 234.5,
  history: 'La historia de juanito aun esta por ser contada.',
  image: 'juanito.jpg',
  express: 'non valid field',
}

module.exports = {
  MOVIEMODEL,
  CHARACTERMODEL,
  GENREMODEL,
  NEWCHARACTER,
  NEWCHARACTER2,
  NEWMOVIE,
  NONVALIDCHARACTER,
  NEWMOVIE2,
  NEWMOVIE3,
}
