import { PrismaClient } from "@prisma/client";
export const dailPrisma = new PrismaClient();

export default async function prismaPlugin(fastify, opts) {
  fastify.decorate("prisma", dailPrisma);

  fastify.addHook("onClose", async (instance) => {
    await dailPrisma.$disconnect();
  });
}
