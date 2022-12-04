module.exports = async (request) => {
  const { db } = request.proxy_data;
  const {
    order = 'created_at desc',
    limit = 10,
    offset = 0,
  } = request.queryStringParameters;

  const { rows: countRows } = await db.query(`
    SELECT count(id)
    FROM posts
  `);
  const [{ count }] = countRows;

  const { rows: posts } = await db.query(
    `
    SELECT *
    FROM posts
    ORDER BY $1
    LIMIT $2
    OFFSET $3
  `,
    [order, limit, offset],
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      code: 200,
      message: 'success',
      results: {
        total_count: Number(count),
        posts,
      },
    }),
  };
};
