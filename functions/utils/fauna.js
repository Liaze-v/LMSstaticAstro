import fetch from 'node-fetch';

export const faunaFetch = async ({ query, variables }) => {
  return await fetch('https://graphql.eu.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(JSON.stringify(err, null, 2)));
};
export default faunaFetch;