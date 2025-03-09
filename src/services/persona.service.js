import { dailPrisma } from "../plugins/prisma.js";

const getAllPersona = async ({ request }) => {
  const tenantPersonas = await dailPrisma.persona.findMany({
    where: {
      tenant_id: request?.user?.tenant?.id,
    },
  });
  return tenantPersonas;
};

export const PERSONA_SERVICE = { getAllPersona };
export default PERSONA_SERVICE;
