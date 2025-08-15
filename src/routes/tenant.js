import TENANT_SERVICES from "../services/tenant.service.js";
import ResponseFormat from "../utils/response_format.js";

const ROUTE_LEVEL_IDENTIFIER = "tenant";

/**
 * Encapsulates tenant routes
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function routes(fastify, options) {
  fastify.get(`/${ROUTE_LEVEL_IDENTIFIER}/check`, async (request, reply) => {
    const { slug } = request.query;

    if (!slug) {
      return ResponseFormat[400]({
        reply,
        message: "Tenant slug is required",
      });
    }

    const tenant = await TENANT_SERVICES.existsBySlugOrName({ text: slug });

    return ResponseFormat[200]({
      reply,
      data: {
        exists: !!tenant,
        ...(!!tenant ? { id: tenant?.id } : {}),
      },
    });
  });
}

export default routes;
