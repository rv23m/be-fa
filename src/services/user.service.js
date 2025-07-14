import { dailPrisma } from "../plugins/prisma.js";
import ResponseFormat from "../utils/response_format.js";
import CALL_TYPE_SERVICE from "./call_type.service.js";
import PERSONA_SERVICE from "./persona.service.js";
import { v4 as uuidv4 } from "uuid";

const usersForStatsCallLogFilter = async ({ request }) => {
  const users = await dailPrisma.user.findMany({
    where: {
      tenant_id: request?.user?.tenant?.id ?? "",
      is_deleted: false,
      is_frozen: false,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  });

  return users;
};

export const USERS_SERVICES = {
  usersForStatsCallLogFilter,
};
export default USERS_SERVICES;
