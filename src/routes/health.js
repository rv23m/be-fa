/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { message: "OK" };
  });
  fastify.get("/health", async (request, reply) => {
    return { message: "OK" };
  });
}

//ESM
export default routes;
