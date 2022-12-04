const fs = require('fs');
const pg = require('../../lib/pg');
const { setHeaders, isUuid } = require('../../lib/utils');
const { errorResponse } = require('../../lib/error');

exports.handler = async (event) => {
  // healthCheck 처리
  if (event?.healthCheck && Object.keys(event).length === 1) {
    return {};
  }

  const db = await pg.connect();

  try {
    const request = event;

    await db.query('BEGIN');
    // info: 경로 파싱 로직
    const separatedProxy = event.pathParameters.proxy.split('/');

    let proxyPath = '';
    separatedProxy.forEach((value) => {
      let currentPath = value;

      if (isUuid(currentPath)) {
        currentPath = 'uuid';
      }

      proxyPath =
        proxyPath === '' ? currentPath : `${proxyPath}/${currentPath}`;
      const isDirectory = fs.existsSync(`./src/posts/${proxyPath}`);

      // case: 해당 루트에 디렉토리가 있는지 확인
      if (!isDirectory) {
        const error = new Error();
        Object.assign(error, {
          statusCode: 400,
          message: 'Bad Request',
        });
        throw error;
      }
    });

    request.proxy_data = {
      db,
    };

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const module = require(`./${proxyPath}/${event.httpMethod.toLowerCase()}`);
    let response = await module(request);
    response = await setHeaders(event, response);

    // 쿼리 커밋
    await db.query('COMMIT');
    return response;
  } catch (e) {
    // 쿼리 롤백
    await db.query('ROLLBACK');
    return errorResponse(e, event);
  } finally {
    db.release();
  }
};
