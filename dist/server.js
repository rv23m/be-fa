// import Fastify from "fastify";
// const fastify = Fastify({ logger: true });
// fastify.get("/", async (request, reply) => {
//   return { message: "Hello, Fastify with TypeScript!" };
// });
// const start = async () => {
//   try {
//     await fastify.listen({ port: 4000 });
//     console.log("Server running at http://localhost:4000");
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };
// start();
// ###
import Fastify from "fastify";
import autoLoad from "@fastify/autoload";
import fastifyEnv from "@fastify/env";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();
const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 4000,
    },
  },
};
const options = {
  confKey: "config", // optional, default: 'config'
  schema: schema,
};
fastify.register(fastifyEnv, options).ready((err) => {
  if (err) console.error(err);
  console.log(fastify.config); // or fastify[options.confKey]
  console.log(fastify.getEnvs());
  // output: { PORT: 4000 }
});
// Add Prisma to Fastify instance
fastify.decorate("prisma", prisma);
fastify.register(autoLoad, {
  dir: join(__dirname, "routes"),
});
const start = async () => {
  try {
    await fastify.listen({ port: 4000 });
    console.log("Server running at http://localhost:4000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
fastify.ready().then(() => {
  start();
});
