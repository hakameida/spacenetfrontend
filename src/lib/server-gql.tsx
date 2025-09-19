const MARKET_SECRET_TOKEN = "sk_live_2f48cae0f7d94b3e9b75a32e61d1ab8a";

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