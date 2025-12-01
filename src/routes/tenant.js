import { dailPrisma } from "../plugins/prisma.js";
import { EMAIL_SERVICE } from "../services/email.service.js";
import TENANT_SERVICES from "../services/tenant.service.js";
import { generateRandomHexColor } from "../utils/generateRandomHexColor.js";
import ResponseFormat from "../utils/response_format.js";
import bcrypt from "bcrypt";
import OpenAI from "openai";
import OpenAIProjectManager from "../utils/openApiProjectManager.js";

const ROUTE_LEVEL_IDENTIFIER = "tenant";

/**
 * Encapsulates tenant routes
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function routes(fastify, options) {
  const client = new OpenAI({
    apiKey: fastify.config.OPENAI_API_KEY, // Load API key from .env
  });
  const projectManager = new OpenAIProjectManager(
    process.env.OPENAI_ADMIN_API_KEY
  );

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

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/getAll`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const tenants = await TENANT_SERVICES.getAllTenants();
      console.log("## all tenants", tenants);
      return ResponseFormat[200]({
        reply,
        data: {
          tenants,
        },
      });
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/updateTenantSeats`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { tenantId, seats } = request.body || {};

      if (!tenantId || !seats) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }

      const tenant = await TENANT_SERVICES.updateTenant({ tenantId, seats });
      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          tenant,
        },
      });
      return reply;
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/create`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      client.project;
      const {
        name,
        slug,
        seats,
        adminUser: { first_name, last_name, email },
      } = request.body || {};

      // TODO: under testing
      const serviceAccountName = name + "-service";
      const description = serviceAccountName;
      // Step 1: Create the project
      const project = await projectManager.createProject(name, description);

      // Step 3: Create service account (which generates an API key)
      const serviceAccount = await projectManager.createServiceAccount(
        project.id,
        serviceAccountName || `${name}-service-account`
      );

      console.log("###", name, serviceAccount, project, serviceAccount);
      return;

      if (!name || !slug || !seats || !first_name || !last_name || !email) {
        return ResponseFormat[400]({
          reply,
          message: "Missing fields.",
        });
      }
      const adminRoleId = "67b272f4ad9d6d15abe44d71";
      const agentRoleId = "67b272f4ad9d6d15abe44d72";
      // TODO: send email and create user and send password
      const password = Math.random().toString(36).substring(2, 10);

      // const tenant = await TENANT_SERVICES.createTenant({
      //   data: {
      //     name,
      //     slug,
      //     seats,
      //     users: {
      //       create: {
      //         first_name,
      //         last_name,
      //         email,
      //         password: await bcrypt.hash(password, 10),
      //         assigned_color: generateRandomHexColor(),
      //         role_id: adminRoleId,
      //       },
      //     },
      //   },
      // });
      const tenant = {
        id: "67b272f6ad9d6d15abe44d75",
      };
      const res = await fetch(
        "https://api.openai.com/v1/organization/api_keys",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${fastify.config.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `tenant_${tenant?.id}`,
            scopes: ["api"],
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create API key: " + (await res.text()));
      }

      const data = await res.json();
      const tenantApiKey = data.key;
      console.log("##tenantApiKey: ", tenantApiKey);
      await dailPrisma.tenant.update({
        where: {
          id: tenant?.id,
        },
        data: {
          open_api_key: tenantApiKey,
        },
      });

      await EMAIL_SERVICE.sendUserLoginEmail(
        email,
        { tenant_id: tenant.id, email, first_name },
        password
      );

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          tenant,
        },
      });
      return reply;
    }
  );

  fastify.delete(
    `/${ROUTE_LEVEL_IDENTIFIER}/remove`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { tenantId } = request.query || {};

      const tenant = await TENANT_SERVICES.deleteTenant({ tenantId });

      // Send response
      ResponseFormat[200]({
        reply,
        data: {
          tenant,
        },
      });
      return reply;
    }
  );

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/getAllActive`,
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const tenants = await TENANT_SERVICES.getAllActiveTenants();

      return ResponseFormat[200]({
        reply,
        data: {
          tenants,
        },
      });
    }
  );
}

export default routes;
