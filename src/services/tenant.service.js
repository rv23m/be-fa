import { dailPrisma } from "../plugins/prisma.js";

async function existsBySlugOrName({ text }) {
  const tenant = await dailPrisma.tenant.findFirst({
    where: {
      is_deleted: false,
      OR: [{ slug: text }, { name: text }],
    },
    select: { id: true }, // minimal data
  });
  return tenant;
}

async function getAllTenants() {
  const tenants = await dailPrisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: {
            where: {
              is_deleted: false,
            },
          },
        },
      },
    },
  });

  return tenants;
}

async function getTenantById(id) {
  const tenants = await dailPrisma.tenant.findUnique({
    where: {
      is_deleted: false,
      id,
    },
  });

  return tenants;
}

async function getAllActiveTenants() {
  const tenants = await dailPrisma.tenant.findMany({
    where: {
      is_deleted: false,
    },
    include: {
      _count: {
        select: {
          users: {
            where: {
              is_deleted: false,
            },
          },
        },
      },
    },
  });

  return tenants;
}

async function createTenant({ data }) {
  const tenant = await dailPrisma.tenant.create({
    data,
    include: {
      users: true,
    },
  });

  return tenant;
}

async function updateTenant({ tenantId, seats }) {
  const tenant = await dailPrisma.tenant.update({
    where: { id: tenantId },
    data: { seats },
  });

  return tenant;
}

async function deleteTenant({ tenantId }) {
  const tenant = await dailPrisma.tenant.update({
    where: { id: tenantId },
    data: { is_deleted: true },
  });

  // todo in schedule queue delete the tenant

  return tenant;
}

export const TENANT_SERVICES = {
  existsBySlugOrName,
  getAllTenants,
  getAllActiveTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
};
export default TENANT_SERVICES;
