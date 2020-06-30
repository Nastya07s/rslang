
import errorsHandler from './errors-handler';

const performRequests = async (promises) => {
  let response;

  try {
    response = await Promise.all(promises);
  } catch (err) {
    errorsHandler.handle(err);
  }

  return response;
};

export default performRequests;
