import TENANT_SERVICES from "../services/tenant.service.js";
import ResponseFormat from "../utils/response_format.js";

async function authenticate(fastify, options) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const decoded = await request.jwtVerify();
      // const mutatedTenant = request.headers["Mutated-Tenant"];
      const mutatedTenant = request.headers["mutated-tenant"];

      console.log("##mutatedTenant", mutatedTenant);

      if (
        (!decoded?.user || !decoded?.user?.tenant) &&
        (!decoded?.pseudoUser || !decoded?.pseudoUser?.tenant)
      ) {
        return ResponseFormat[401]({
          reply,
          message: "INVALID_TOKEN",
        });
      }

      const mutatedTenantDetail = [];
      if (mutatedTenant) {
        mutatedTenantDetail.push(
          await TENANT_SERVICES.getTenantById(mutatedTenant)
        );
      }

      request.user = decoded?.user;
      request.tenant = mutatedTenant
        ? mutatedTenantDetail?.[0] ?? decoded?.user?.tenant
        : decoded?.user?.tenant;
      request.pseudoUser = decoded?.pseudoUser;

      console.log(request?.tenant);
    } catch (err) {
      console.log("err", err);
      return ResponseFormat[401]({
        reply,
        message: "INVALID_TOKEN",
      });
    }
  });
}

export default authenticate;
