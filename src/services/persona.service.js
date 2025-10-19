import { dailPrisma } from "../plugins/prisma.js";
import { PERSONA_UTIL } from "../utils/persona_generator.js";

const getAllPersona = async ({ request }) => {
  const tenantPersonas = await dailPrisma.persona.findMany({
    where: {
      tenant_id: request?.user?.tenant?.id,
      is_deleted: false,
    },
  });
  return tenantPersonas;
};

const createPersona = async ({ request, name, job, industry, objection }) => {
  const createdPersona = await dailPrisma.persona.create({
    data: {
      name: name,
      job: job,
      industry: industry,
      objection: objection,
      prompt: PERSONA_UTIL.generateSystemPrompt(name, job, industry, objection),
      // prompt: PERSONA_UTIL.generateSystemPrompt(
      //   `${name}, ${job}`,
      //   industry,
      //   objection
      // ),
      tenant: {
        connect: {
          id: request?.tenant?.id,
        },
      },
    },
  });

  return createdPersona;
};

const deletePersona = async ({ request, reply, personaId }) => {
  const users = await dailPrisma.persona.update({
    where: {
      id: personaId,
    },
    data: {
      is_deleted: true,
    },
  });

  return users;
};

const updatePersona = async ({ request, personaId, prompt }) => {
  const createdPersona = await dailPrisma.persona.update({
    where: { id: personaId },
    data: {
      prompt,
    },
  });

  return createdPersona;
};

export const PERSONA_SERVICE = {
  getAllPersona,
  createPersona,
  deletePersona,
  updatePersona,
};
export default PERSONA_SERVICE;
