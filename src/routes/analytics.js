import ResponseFormat from "../utils/response_format.js";
import ANALYTICS_SERVICE from "../services/analytics.service.js";

const ROUTE_LEVEL_IDENTIFIER = "analytics";

/**
 * Encapsulates tenant routes
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function routes(fastify, options) {
  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/getAll`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const analytics = await ANALYTICS_SERVICE.getAnalyticsByUser({
        req: request,
      });
      return ResponseFormat[200]({
        reply,
        data: {
          analytics,
        },
      });
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { eventType, data } = request.body || {};

      if (!eventType) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }

      const analytics = await ANALYTICS_SERVICE.createAnalytics({
        req: request,
        eventType,
        data: data || "",
      });
      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          analytics,
        },
      });
      return reply;
    }
  );
}

export default routes;
