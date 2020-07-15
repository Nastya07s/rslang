export default {
  old: { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.degreeOfKnowledge': { $gte: 5 } }] },
  learning: { $and: [{ $nor: [{ userWord: null }] }, { 'userWord.optional.degreeOfKnowledge': { $gte: 1, $lte: 5 } }] },
  new: { $and: [{ userWord: null }] },
};
