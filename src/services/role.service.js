import { dailPrisma } from "../plugins/prisma.js";
import bcrypt from "bcrypt";

const getRoles = async ({ request }) => {
  const roles = await dailPrisma.role.findMany({});

  return roles;
};

export const ROLES_SERVICES = {
  getRoles,
};
export default ROLES_SERVICES;
