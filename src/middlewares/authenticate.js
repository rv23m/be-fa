import ResponseFormat from "../utils/response_format.js";

async function authenticate(fastify, options) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const decoded = await request.jwtVerify();

      if (
        (!decoded?.user || !decoded?.user?.tenant) &&
        (!decoded?.pseudoUser || !decoded?.pseudoUser?.tenant)
      ) {
        return ResponseFormat[401]({
          reply,
          message: "INVALID_TOKEN",
        });
      }

      request.user = decoded?.user;
      request.tenant = decoded?.user?.tenant;
      request.pseudoUser = decoded?.pseudoUser;
    } catch (err) {
      return ResponseFormat[401]({
        reply,
        message: "INVALID_TOKEN",
      });
    }
  });
}

export default authenticate;
