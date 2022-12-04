const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

/**
 * Set Headers
 * @param event
 * @param object
 * @returns Promise<{}>
 */
exports.setHeaders = (event, object) => {
  const result = object;
  result.headers = {
    'Access-Control-Allow-Origin': event.headers?.origin,
  };
  return result;
};

/**
 * uuid 검증기
 * @param string
 * @returns {boolean}
 */
exports.isUuid = (string) => {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(string);
};
