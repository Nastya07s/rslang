export default {
  old: { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.countRepetition': { $gte: 4 } }] },
  learning: { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.countRepetition': { $lt: 4 } }] },
  new: { $and: [{ userWord: null }] },
};
