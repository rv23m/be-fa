import USERS_SERVICES from "../services/user.service.js";
import ResponseFormat from "../utils/response_format.js";
import bcrypt from "bcrypt";

const ROUTE_LEVEL_IDENTIFIER = "onboarding";
// TODO: REWORK
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/user/setup`,
    async (request, reply) => {
      const { password } = request.body || {};
      console.log("request.pseudoUser", request.pseudoUser);
      if (
        !request?.pseudoUser?.email ||
        !request?.pseudoUser?.tenant_id ||
        !password
      ) {
        return ResponseFormat[400]({
          reply,
          message: "Invalid token or password is required.",
        });
      }

      // Fetch user from DB
      const user = await USERS_SERVICES.findByEmail({
        email: request?.pseudoUser?.email,
        tenantId: request?.pseudoUser?.tenant_id,
      });

      if (!user) {
        return ResponseFormat[401]({
          reply,
          message: "Invalid email or password.",
        });
      }

      // Fetch user from DB
      const userUpdated = await USERS_SERVICES.updateUser({
        email: request?.pseudoUser?.email,
        tenantId: request?.pseudoUser?.tenant?.id,
        first_name: request?.pseudoUser?.first_name,
        last_name: request?.pseudoUser?.last_name,
        password,
      });

      delete user.password;

      // Create JWT token
      const jwtUser = {
        ...userUpdated,
      };

      delete jwtUser.password;
      // TODO: store token in db
      const token = fastify.jwt.sign(
        {
          user: jwtUser,
        },
        { expiresIn: "7d" }
      );

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          token,
          user: jwtUser,
        },
      });
      return reply;
    }
  );
}

//ESM
export default routes;
