import errorsHandler from './errors-handler';

const performRequests = async (functions) => {
  let response;

  try {
    if (!navigator.onLine) {
      throw new Error(errorsHandler.ERROR_STATUSES.NO_CONNECTION);
    }

    const promises = functions.map((func) => func());

    response = await Promise.all(promises);
  } catch (err) {
    errorsHandler.handle(err.message);
  }

  return response;
};

export default performRequests;
