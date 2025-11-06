import { dailPrisma } from "../plugins/prisma.js";
import bcrypt from "bcrypt";
import ResponseFormat from "../utils/response_format.js";
import { generateRandomHexColor } from "../utils/generateRandomHexColor.js";

const usersForStatsCallLogFilter = async ({ request }) => {
  const canSeeTeamStats = request?.user?.role?.canSeeTeamStats;
  const users = await dailPrisma.user.findMany({
    where: {
      tenant_id: request?.user?.tenant?.id ?? "",
      ...(canSeeTeamStats ? {} : { id: request?.user?.id }),
      is_deleted: false,
      is_frozen: false,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role_id: true,
      role: true,
    },
  });

  return users;
};

const findByEmail = async ({ email, tenantId }) => {
  const users = await dailPrisma.user.findUnique({
    where: {
      tenant_id: tenantId ?? "",
      email: email,
    },
    include: {
      tenant: true,
      role: true,
    },
  });

  return users;
};

const updateUser = async ({
  email,
  tenantId,
  first_name,
  last_name,
  password,
}) => {
  const users = await dailPrisma.user.update({
    where: {
      tenant_id: tenantId ?? "",
      email: email,
    },
    data: {
      first_name,
      last_name,
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    },
    include: {
      tenant: true,
      role: true,
    },
  });

  return users;
};

const updateUserRole = async ({ request, reply, userId, roleId }) => {
  const adminRoleId = "67b272f4ad9d6d15abe44d71";
  const agentRoleId = "67b272f4ad9d6d15abe44d72";

  if (roleId === agentRoleId) {
    const adminCount = await dailPrisma.user.count({
      where: {
        role_id: adminRoleId,
        tenant_id: request?.tenant?.id ?? "",
      },
    });
    if (adminCount <= 1) {
      return ResponseFormat[403]({
        reply,
        message: "There should be atleast 1 admin.",
      });
    }
  }

  const users = await dailPrisma.user.update({
    where: {
      tenant_id: request?.tenant?.id ?? "",
      id: userId,
    },
    data: {
      role_id: roleId,
    },
    include: {
      tenant: true,
      role: true,
    },
  });

  return users;
};

const createNewUser = async ({
  request,
  first_name,
  last_name,
  email,
  password,
  roleId,
}) => {
  const users = await dailPrisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(password, 10),
      assigned_color: generateRandomHexColor(),
      role: {
        connect: { id: roleId },
      },
      tenant: {
        connect: {
          id: request?.tenant?.id,
        },
      },
    },
  });

  return users;
};

const deleteUser = async ({ request, reply, userId, roleId }) => {
  const adminRoleId = "67b272f4ad9d6d15abe44d71";
  // const agentRoleId = "67b272f4ad9d6d15abe44d72";

  if (roleId === adminRoleId) {
    const adminCount = await dailPrisma.user.count({
      where: {
        role_id: adminRoleId,
        tenant_id: request?.tenant?.id ?? "",
      },
    });
    if (adminCount <= 1) {
      return ResponseFormat[403]({
        reply,
        message: "There should be atleast 1 admin.",
      });
    }
  }

  await dailPrisma.$transaction([
    dailPrisma.role_play_call.deleteMany({
      where: { tenant_id: request?.tenant?.id ?? "", id: userId },
    }),
    dailPrisma.user.delete({
      where: { tenant_id: request?.tenant?.id ?? "", id: userId },
    }),
  ]);

  const users = await dailPrisma.user.delete({
    where: {
      tenant_id: request?.tenant?.id ?? "",
      id: userId,
    },
  });

  return users;
};

export const USERS_SERVICES = {
  usersForStatsCallLogFilter,
  findByEmail,
  updateUser,
  updateUserRole,
  createNewUser,
  deleteUser,
};
export default USERS_SERVICES;
