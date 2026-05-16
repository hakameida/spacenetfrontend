const { GraphQLClient, gql } = require('graphql-request');

const endpoint = 'https://dockergqlserver.onrender.com/graphql/';
const MARKET_SECRET_TOKEN = 'sk_live_2f48cae0f7d94b3e9b75a32e61d1ab8a';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://spacenetstore.com', // Replace with your production domain
  generateRobotsTxt: true,
  exclude: [
    '/search/[searchWord]',
    '/laptops/[laptopId]',
    '/offers/[id]',
  ],
  additionalPaths: async () => {
    const client = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${MARKET_SECRET_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const query = gql`
      query MyQuery {
        allLaptops {
          id
        }
        allOffers {
          id
        }
      }
    `;

    try {
      const data = await client.request(query);

      const laptopPaths = data.allLaptops.map((laptop) => ({
        loc: `/laptops/${laptop.id}`,
        lastmod: new Date().toISOString(),
      }));

      const offerPaths = data.allOffers.map((offer) => ({
        loc: `/offers/${offer.id}`,
        lastmod: new Date().toISOString(),
      }));

      return [...laptopPaths, ...offerPaths];
    } catch (err) {
      console.error('❌ Failed to fetch data for sitemap:', err.message);
      return [];
    }
  },
};
