import {
  PRACTISE_CALL_SUMMARIZE_PROMPT,
  RANKED_CALL_SUMMARIZE_PROMPT,
} from "../constants/prompts.js";
import PERSONA_SERVICE from "../services/persona.service.js";
import { PERSONA_UTIL } from "../utils/persona_generator.js";
import ResponseFormat from "../utils/response_format.js";

const ROUTE_LEVEL_IDENTIFIER = "persona";
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(`/${ROUTE_LEVEL_IDENTIFIER}/getAll`, async (request, reply) => {
    const personas = await PERSONA_SERVICE.getAllPersona({
      request,
    });
    ResponseFormat[200]({
      reply,
      data: {
        personas: personas,
      },
    });
    return reply;
  });

  fastify.post(`/${ROUTE_LEVEL_IDENTIFIER}/create`, async (request, reply) => {
    const { job, industry, objection } = request.body || {};

    if (!job || !industry || !objection) {
      return ResponseFormat[400]({
        reply,
        message: "Missing fields.",
      });
    }

    const personas = await PERSONA_SERVICE.getAllPersona({ request });

    // Fetch user from DB
    const persona = await PERSONA_SERVICE.createPersona({
      request,
      name: PERSONA_UTIL.generateNames({
        preExistingNames: personas?.map((e) => e.name),
      }),
      job,
      industry,
      objection,
    });

    // Send response
    ResponseFormat[200]({
      reply,
      data: {
        persona,
      },
    });
    return reply;
  });

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/updatePrompt`,
    async (request, reply) => {
      const { personaId, prompt } = request.body || {};

      if (!personaId || !prompt) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }

      // Fetch user from DB
      const persona = await PERSONA_SERVICE.updatePersona({
        request,
        personaId,
        prompt,
      });

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          persona,
        },
      });
      return reply;
    }
  );

  fastify.delete(
    `/${ROUTE_LEVEL_IDENTIFIER}/remove`,
    async (request, reply) => {
      const { personaId } = request.query || {};

      if (!personaId) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }

      // Fetch user from DB
      const persona = await PERSONA_SERVICE.deletePersona({
        request,
        reply,
        personaId,
      });

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          persona,
        },
      });
      return reply;
    }
  );
}

//ESM
export default routes;
