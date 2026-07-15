const { GraphQLClient, gql } = require('graphql-request');

const endpoint = 'https://api.spacenetstore.com/graphql/';
const MARKET_SECRET_TOKEN = process.env.MARKET_SECRET_TOKEN;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://spacenetstore.com',
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

    // Define queries
    const queries = {
      laptops: gql`
        query GetLaptops {
          allLaptops {
            id
          }
        }
      `,
      offers: gql`
        query GetOffers {
          allOffers {
            id
          }
        }
      `,
      computers: gql`
        query GetComputers {
          allComputers {
            id
          }
        }
      `,
      accessories: gql`
        query GetAccessories {
          allAccessories {
            id
          }
        }
      `,
      // Try different field names for Playstations
      playstations: gql`
        query GetPlaystations {
          allPlaystations {
            id
          }
        }
      `,
      // Try different field names for Cameras
      cameras: gql`
        query GetCameras {
          allCameras {
            id
          }
        }
      `,
    };

    const allPaths = [];

    // Extracts an array of items regardless of whether the field is a
    // plain list (e.g. [{id:1}, {id:2}]) or a Relay-style connection
    // (e.g. { edges: [{ node: {id:1} }] } or { items: [...] }).
    const extractItems = (value) => {
      if (Array.isArray(value)) {
        return value;
      }
      if (value && Array.isArray(value.edges)) {
        return value.edges.map((edge) => edge.node ?? edge);
      }
      if (value && Array.isArray(value.items)) {
        return value.items;
      }
      if (value && Array.isArray(value.results)) {
        return value.results;
      }
      return null;
    };

    // Only try queries that exist
    const tryQuery = async (name, query, pathPrefix) => {
      try {
        const data = await client.request(query);

        // TEMP DEBUG: log the raw shape so you can see exactly what
        // each field returns. Remove once everything is working.
        console.log(`🔍 ${name} raw response:`, JSON.stringify(data));

        const key = Object.keys(data)[0];
        const items = extractItems(data[key]);

        if (items === null) {
          console.log(
            `⚠️ ${name}: field "${key}" exists but isn't a recognized list shape (not array/edges/items/results)`
          );
          return;
        }

        const paths = items.map((item) => ({
          loc: `${pathPrefix}/${item.id}`,
          lastmod: new Date().toISOString(),
        }));
        allPaths.push(...paths);
        console.log(`✅ ${name}: ${paths.length} paths`);
      } catch (err) {
        console.log(`ℹ️ ${name}: Skipped (${err.message})`);
      }
    };

    await tryQuery('Laptops', queries.laptops, '/laptops');
    await tryQuery('Offers', queries.offers, '/offers');
    await tryQuery('Computers', queries.computers, '/computer');
    await tryQuery('Accessories', queries.accessories, '/accessories');
    // These might fail, but that's OK
    await tryQuery('Playstations', queries.playstations, '/playstations');
    await tryQuery('Cameras', queries.cameras, '/cameras');

    console.log(`✅ Total sitemap paths: ${allPaths.length}`);
    return allPaths;
  },
};