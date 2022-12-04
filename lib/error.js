const { setHeaders } = require('./utils');

/**
 * Error Response
 * @param error
 * @param filename
 * @param event
 * @returns <*>
 */
exports.errorResponse = (error, event) => {
  if (Object.keys(error).legnth === 0) {
    return setHeaders(event, {});
  }

  const statusCode = error.response?.status || error.statusCode || 500;
  const message =
    error.response?.data?.message || error.message || 'Internal Server Error';

  console.error('[Error]', error);

  return setHeaders(event, {
    statusCode,
    body: JSON.stringify({
      code: statusCode,
      message,
    }),
  });
};
