import { dailPrisma } from "../plugins/prisma.js";

async function existsBySlugOrName({ text }) {
  const tenant = await dailPrisma.tenant.findFirst({
    where: {
      OR: [{ slug: text }, { name: text }],
    },
    select: { id: true }, // minimal data
  });
  return tenant;
}

export const TENANT_SERVICES = {
  existsBySlugOrName,
};
export default TENANT_SERVICES;
