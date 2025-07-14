import {
  PRACTISE_CALL_SUMMARIZE_PROMPT,
  RANKED_CALL_SUMMARIZE_PROMPT,
} from "../constants/prompts.js";
import CALL_TYPE_SERVICE from "../services/call_type.service.js";
import ROLE_PLAY_CALL_SERVICES from "../services/role_play_call.service.js";
import USERS_SERVICES from "../services/user.service.js";
import ResponseFormat from "../utils/response_format.js";
import OpenAI from "openai";

const ROUTE_LEVEL_IDENTIFIER = "user";
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const openai = new OpenAI({
    apiKey: fastify.config.OPENAI_API_KEY, // Load API key from .env
  });

  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/allUsersForCallLogsFilter`,
    // { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const users = await USERS_SERVICES.usersForStatsCallLogFilter({
        request,
      });
      ResponseFormat[200]({
        reply,
        data: {
          users,
        },
      });
      return reply;
    }
  );
}

//ESM
export default routes;
