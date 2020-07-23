const getWordDetalization = async (word) => {
  try {
    const rawResponse = await fetch(
      `https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word}`,
    );
    const content = await rawResponse.json();
    return content;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export default getWordDetalization;
