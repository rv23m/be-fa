import {
  PRACTISE_CALL_SUMMARIZE_PROMPT,
  RANKED_CALL_SUMMARIZE_PROMPT,
} from "../constants/prompts.js";
import CALL_TYPE_SERVICE from "../services/call_type.service.js";
import { EMAIL_SERVICE } from "../services/email.service.js";
import ROLES_SERVICES from "../services/role.service.js";
import ROLE_PLAY_CALL_SERVICES from "../services/role_play_call.service.js";
import USERS_SERVICES from "../services/user.service.js";
import ResponseFormat from "../utils/response_format.js";

const ROUTE_LEVEL_IDENTIFIER = "user";
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/allUsersForCallLogsFilter`,
    async (request, reply) => {
      const users = await USERS_SERVICES.usersForStatsCallLogFilter({
        request,
      });
      ResponseFormat[200]({
        reply,
        data: {
          user: users,
        },
      });
      return reply;
    }
  );

  fastify.post(`/${ROUTE_LEVEL_IDENTIFIER}/update`, async (request, reply) => {
    const { first_name, last_name, password } = request.body || {};

    if (!first_name || !last_name) {
      return ResponseFormat[400]({
        reply,
        message: "First name and last name are required.",
      });
    }

    // Fetch user from DB
    const user = await USERS_SERVICES.updateUser({
      email: request?.user?.email,
      tenantId: request.tenant?.id,
      first_name,
      last_name,
      password,
    });

    delete user.password;

    // Send response
    ResponseFormat[200]({
      reply,
      data: {
        user,
      },
    });
    return reply;
  });

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/roles`,

    async (request, reply) => {
      const roles = await ROLES_SERVICES.getRoles({
        request,
      });
      ResponseFormat[200]({
        reply,
        data: {
          roles: roles,
        },
      });
      return reply;
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/update-role`,
    async (request, reply) => {
      const { userId, roleId } = request.body || {};

      if (!userId || !roleId) {
        return ResponseFormat[400]({
          reply,
          message: "User Id and role are required.",
        });
      }

      // Fetch user from DB
      const user = await USERS_SERVICES.updateUserRole({
        request,
        reply,
        userId,
        roleId,
      });

      delete user.password;

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          user,
        },
      });
      return reply;
    }
  );

  fastify.post(`/${ROUTE_LEVEL_IDENTIFIER}/create`, async (request, reply) => {
    const { first_name, last_name, roleId, email } = request.body || {};

    if (!first_name || !last_name || !email || !roleId) {
      return ResponseFormat[400]({
        reply,
        message: "Missing fields.",
      });
    }
    // TODO: send email and create user and send password
    const password = Math.random().toString(36).substring(2, 10);

    // Fetch user from DB
    const user = await USERS_SERVICES.createNewUser({
      request,
      reply,
      first_name,
      last_name,
      email,
      password,
      roleId,
    });
    user.tenant_id;

    await EMAIL_SERVICE.sendUserLoginEmail(email, user, password);

    delete user.password;

    // Send response
    ResponseFormat[200]({
      reply,
      data: {
        user,
      },
    });
    return reply;
  });

  fastify.delete(
    `/${ROUTE_LEVEL_IDENTIFIER}/remove`,
    async (request, reply) => {
      const { userId, roleId } = request.query || {};

      if (!userId || !roleId) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }

      // Fetch user from DB
      const user = await USERS_SERVICES.deleteUser({
        request,
        reply,
        userId,
        roleId,
      });

      delete user.password;

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          user,
        },
      });
      return reply;
    }
  );
}

//ESM
export default routes;
