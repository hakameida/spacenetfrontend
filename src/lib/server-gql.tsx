const MARKET_SECRET_TOKEN = process.env.MARKET_SECRET_TOKEN;
export async function getProductById(id: string) {
  const query = `
    query GetProductById($id: String!) {
      productById(id: $id) {
        name
        price
        description
      }
    }
  `;

  const res = await fetch("https://dockergqlserver.onrender.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MARKET_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
    cache: "no-store", // Optional: prevents stale data
  });

  const json = await res.json();
  return json.data?.productById;
}