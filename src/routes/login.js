import { EMAIL_SERVICE } from "../services/email.service.js";
import USERS_SERVICES from "../services/user.service.js";
import ResponseFormat from "../utils/response_format.js";
import bcrypt from "bcrypt";

const ROUTE_LEVEL_IDENTIFIER = "login";
// TODO: REWORK
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  fastify.post(`/${ROUTE_LEVEL_IDENTIFIER}/user`, async (request, reply) => {
    const { email, password, tenantId } = request.body || {};

    if (!email || !password || !tenantId) {
      return ResponseFormat[400]({
        reply,
        message: "Email and password are required.",
      });
    }

    // Fetch user from DB
    const user = await USERS_SERVICES.findByEmail({ email, tenantId });

    if (!user) {
      return ResponseFormat[401]({
        reply,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return ResponseFormat[401]({
        reply,
        message: "Invalid email or password.",
      });
    }

    // Create JWT token
    const jwtUser = {
      ...user,
    };

    delete jwtUser.password;
    // TODO: store token in db
    const token = fastify.jwt.sign(
      {
        ...(user?.isFirstTimeLogin
          ? { pseudoUser: jwtUser }
          : { user: jwtUser }),
      },
      { expiresIn: user?.isFirstTimeLogin ? "1d" : "7d" }
    );

    // Send response
    ResponseFormat[200]({
      reply,
      data: {
        token,
        user: jwtUser,
        isSetup: user?.isFirstTimeLogin,
      },
    });
    return reply;
  });

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/forgotPassword`,
    async (request, reply) => {
      const { email, tenantId } = request.body || {};

      if (!email || !tenantId) {
        return ResponseFormat[400]({
          reply,
          message: "Email and password are required.",
        });
      }

      // Fetch user from DB
      const user = await USERS_SERVICES.findByEmail({ email, tenantId });

      if (!user) {
        return ResponseFormat[401]({
          reply,
          message: "Invalid email or password.",
        });
      }

      // Create JWT token
      const jwtUser = {
        ...user,
      };

      delete jwtUser.password;
      // TODO: store token in db
      const token = fastify.jwt.sign(
        {
          pseudoUser: jwtUser,
        },
        { expiresIn: "1d" }
      );
      EMAIL_SERVICE.sendPasswordResetEmail(email, user, token);
      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          message: "Password reset email sent.",
        },
      });
      return reply;
    }
  );
}

//ESM
export default routes;
