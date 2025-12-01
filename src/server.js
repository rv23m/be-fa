import Fastify from "fastify";
import axios from "axios";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

import autoLoad from "@fastify/autoload";
import fastifyJWT from "@fastify/jwt";
import fastifyEnv from "@fastify/env";
import fastifyCompress from "@fastify/compress";
import fastifyHelmet from "@fastify/helmet";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCsrf from "@fastify/csrf-protection";
import fastifyUrlData from "@fastify/url-data";
import fastifyRoutes from "@fastify/routes";
import fastifyRoutesStats from "@fastify/routes-stats";
import fastifyCircuitBreaker from "@fastify/circuit-breaker";
import fastifyExpress from "@fastify/express";
import serverless from "serverless-http";
import { z } from "zod";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { EMAIL_SERVICE } from "./services/email.service.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true,
});

// Load environment variables
const envSchema = {
  type: "object",
  required: ["JWT_SECRET", "DATABASE_URL"],
  properties: {
    PORT: { type: "integer" },
    DATABASE_URL: { type: "string" },
    JWT_SECRET: { type: "string" },
    OPENAI_API_KEY: { type: "string" },
    FRONTEND_URL: { type: "string" },
  },
};

await fastify.register(fastifyEnv, {
  schema: envSchema,
  // dotenv: true,
  dotenv: {
    path: `${__dirname}/../.env`,
    debug: true,
  },
  confKey: "config",
});

await fastify.register(fastifyJWT, { secret: process.env.JWT_SECRET });
await fastify.register(fastifyCompress, { global: true });
await fastify.register(fastifyHelmet);
await fastify.register(fastifyCookie);
await fastify.register(fastifyCors, {
  origin: "*", // Change this to your frontend URL for security
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Mutated-Tenant"],
  credentials: true, // ✅ Allow credentials (important for streaming)
  exposedHeaders: ["Content-Type", "Authorization", "Mutated-Tenant"], // ✅ Expose required headers
});
await fastify.register(fastifyFormbody);
await fastify.register(fastifyMultipart);
await fastify.register(fastifyRateLimit, { max: 100, timeWindow: "1 minute" });
await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Fastify API",
      description: "Testing Fastify",
      version: "1.0.0",
    },
  },
});

await fastify.register(fastifySwaggerUI);
await fastify.register(fastifyCsrf);
await fastify.register(fastifyUrlData);
await fastify.register(fastifyRoutes);
// await fastify.register(fastifyRoutesStats, {
//   decoratorName: "performanceMarked", // decorator is set to true if a performance.mark was called for the request
//   printInterval: 4000, // milliseconds
// });
await fastify.register(fastifyCircuitBreaker);
await fastify.register(fastifyExpress);

// Middleware for JWT authentication
// fastify.decorate("authenticate", async (request, reply) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ error: "Unauthorized" });
//   }
// });

// fastify.get("/", async (request, reply) => {
//   reply.send({
//     message: "OK",
//     config: fastify.config ?? "not found",
//     j: fastify.config?.JWT_SECRET ?? "na",
//   });
// });
// // User registration
// fastify.post("/register", async (request, reply) => {
//   const schema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
//   });

//   const { email, password } = schema.parse(request.body);

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return reply.code(400).send({ error: "User already exists" });
//   }

//   const user = await prisma.user.create({ data: { email, password } });
//   reply.send({ id: user.id, email: user.email });
// });

// // User login
// fastify.post("/login", async (request, reply) => {
//   const schema = z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
//   });

//   const { email, password } = schema.parse(request.body);

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user || user.password !== password) {
//     return reply.code(401).send({ error: "Invalid credentials" });
//   }

//   const token = fastify.jwt.sign({ id: user.id });
//   reply.send({ token });
// });

// // Protected route
// fastify.get(
//   "/profile",
//   // { preHandler: [fastify.authenticate] },
//   async (request, reply) => {
//     const user = await prisma.user.findUnique({
//       where: { id: request.user.id },
//     });
//     reply.send(user);
//   }
// );

// const rolePlayPrompt =
//   "You are role playing as a potential sales lead that is being sold a product. Here are some instructions: - Do not narrate what you are doing - Your name is Taylor- Your role is [CEO] - Your industry is [Design]- Your objection is [Budget Concerns]";

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY, // Load API key from .env
// });

// fastify.post("/sales-training", async (request, reply) => {
//   const { userMessage } = request.body;

//   if (!userMessage) {
//     return reply.status(400).send({ error: "Message is required." });
//   }

//   try {
//     // Send request to OpenAI API with Taylor Morgan's role and user's message
//     // OpenAI API call
//     const response = await openai.chat.completions.create({
//       model: "gpt-4-turbo",
//       messages: [
//         {
//           role: "system",
//           content: rolePlayPrompt,
//         },
//         { role: "user", content: userMessage },
//       ],
//       temperature: 1,
//       max_tokens: 2048,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });

//     // Send back the response
//     reply.send({ message: response.choices[0].message.content, response });
//   } catch (error) {
//     console.error("Error with OpenAI API:", error?.message, error);
//     return reply.status(500).send({ error: "Internal server error." });
//   }
// });

await fastify.register(autoLoad, {
  dir: join(__dirname, "plugins"),
  encapsulate: false,
});

await fastify.register(autoLoad, {
  dir: join(__dirname, "middlewares"),
  encapsulate: false,
});

const routeDir = join(__dirname, "routes");
for (const file of fs.readdirSync(routeDir)) {
  const fullPath = path.join(routeDir, file);
  console.log("🧩 Checking route:", fullPath);

  try {
    const mod = await import(fullPath);
    console.log("✅ Loaded:", file);
  } catch (err) {
    console.error("❌ Failed to import:", file, err);
  }
}

try {
  await fastify.register(autoLoad, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/api/v1" },
  });
} catch (err) {
  fastify.log.error(err);
  console.error("❌ Error while registering plugins:", err);
}

fastify.listen({ port: 4000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

// export default serverless(fastify);
export default async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit("request", req, res);
}
