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
    const jwtUser = { ...user };
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
  });
}

//ESM
export default routes;
