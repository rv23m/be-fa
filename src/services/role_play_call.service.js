import { dailPrisma } from "../plugins/prisma.js";
import ResponseFormat from "../utils/response_format.js";
import CALL_TYPE_SERVICE from "./call_type.service.js";
import PERSONA_SERVICE from "./persona.service.js";
import { v4 as uuidv4 } from "uuid";

const getPreExistingCallOfCallType = async ({ request, call_type_id }) => {
  const preExistingCall = await dailPrisma.role_play_call.findFirst({
    where: {
      user_id: request?.user?.id ?? "",
      tenant_id: request?.user?.tenant?.id ?? "",
      call_type_id: call_type_id ?? "",
      is_deleted: false,
      call_start_time: undefined,
      session_closed: false,
    },
    select: {
      id: true,
      session_id: true,
      created_at: true,
      updated_at: true,
      transcript: false,
      call_type: true,
      call_start_time: true,
      persona: {
        select: {
          name: true,
          prompt: true,
          // job: true,
          // objection: true,
          // industry: true,
        },
      },
    },
  });

  return preExistingCall;
};

const fetchRecentRolePlayCallBySession = async ({ request, session_id }) => {
  const rolePlayCall = await dailPrisma.role_play_call.findFirst({
    orderBy: {
      created_at: "desc",
    },
    where: {
      user_id: request?.user?.id ?? "",
      tenant_id: request?.user?.tenant?.id ?? "",
      session_id: session_id ?? "",
    },
    select: {
      id: true,
      session_id: true,
      created_at: true,
      updated_at: true,
      call_type: true,
      call_start_time: true,
      call_end_time: true,
      cleaned_transcript: true,
      persona: {
        select: {
          name: true,
          prompt: true,

          // job: true,
          // objection: true,
          // industry: true,
        },
      },
      transcript: true,
      session_closed: true,
      listen_to_talk_ratio: true,
      close_rate: true,
      objection_resolution: true,
    },
  });

  return rolePlayCall;
};

const fetchRecentRolePlayRankedClosedCall = async ({ request }) => {
  const latestRolePlayCall = await dailPrisma.role_play_call.findFirst({
    orderBy: {
      created_at: "desc",
    },
    where: {
      user_id: request?.user?.id ?? "",
      tenant_id: request?.user?.tenant?.id ?? "",
      call_type: {
        name: "ranked",
      },
      session_closed: true,
    },
  });

  return latestRolePlayCall;
};

const fetchRecentRolePlayRankedCall = async ({ request }) => {
  const latestRolePlayCall = await dailPrisma.role_play_call.findFirst({
    orderBy: {
      created_at: "desc",
    },
    where: {
      user_id: request?.user?.id ?? "",
      tenant_id: request?.user?.tenant?.id ?? "",
      call_type: {
        name: "ranked",
      },
      session_closed: false,
    },
  });

  return latestRolePlayCall;
};

const createRankedCallWithDefaultRule = async ({ request, reply }) => {
  const rankedCallType = await CALL_TYPE_SERVICE.getRankedCallType();

  let chosenPersonaId = "";

  const tenantPersonas = await PERSONA_SERVICE.getAllPersona({ request });

  if (!tenantPersonas?.length) {
    return ResponseFormat[400]({
      reply,
      message: "No persona found.",
    });
  } else if (tenantPersonas?.length === 1) {
    chosenPersonaId = tenantPersonas?.[0]?.id;
  } else {
    const latestRolePlayCall = await fetchRecentRolePlayRankedClosedCall({
      request,
    });

    let randomizedSetOfPersonaId = tenantPersonas?.map(
      (persona) => persona?.id
    );

    if (latestRolePlayCall) {
      randomizedSetOfPersonaId?.filter(
        (id) => id !== latestRolePlayCall?.persona_id
      );
    }

    chosenPersonaId =
      randomizedSetOfPersonaId[
        Math.floor(Math.random() * randomizedSetOfPersonaId.length)
      ];
  }

  const newRolePlayCall = await dailPrisma.role_play_call.create({
    data: {
      session_id: uuidv4(),
      tenant_id: request?.user?.tenant?.id,
      user_id: request?.user?.id,
      persona_id: chosenPersonaId,
      call_type_id: rankedCallType?.id, // ranked id al
    },
    select: {
      id: true,
      session_id: true,
      created_at: true,
      updated_at: true,
      transcript: false,
      call_type: true,
      call_start_time: true,
      persona: {
        select: {
          name: true,
          prompt: true,

          // job: true,
          // objection: true,
          // industry: true,
        },
      },
    },
  });

  return newRolePlayCall;
};

const createPractiseRankedCallWithSpecifiedPersona = async ({
  request,
  persona_id,
}) => {
  const practiseCallType = await CALL_TYPE_SERVICE.getPractiseCallType();

  const newRolePlayCall = await dailPrisma.role_play_call.create({
    data: {
      session_id: uuidv4(),
      tenant_id: request?.user?.tenant?.id,
      user_id: request?.user?.id,
      persona_id: persona_id,
      call_type_id: practiseCallType?.id, // ranked id al
    },
    select: {
      id: true,
      session_id: true,
      created_at: true,
      updated_at: true,
      transcript: false,
      call_type: true,
      call_start_time: true,
      persona: {
        select: {
          name: true,
          prompt: true,

          // job: true,
          // objection: true,
          // industry: true,
        },
      },
    },
  });
  return newRolePlayCall;
};

const updateRolePlayCallBySession = async ({ request, session_id, data }) => {
  const updatedRolePlayCall = await dailPrisma.role_play_call.update({
    where: {
      tenant_id: request?.user?.tenant?.id,
      user_id: request?.user?.id,
      session_id: session_id,
    },
    data: {
      ...data,
    },
  });

  return updatedRolePlayCall;
};

const fetchRecentRolePlayCallAll = async ({ request }) => {
  const { userIds = [], sort = [], startDate, endDate } = request.body ?? {};
  const canSeeTeamStats = request?.user?.role?.canSeeTeamStats;

  const allowedSortFields = [
    "listen_to_talk_ratio",
    "close_rate",
    "objection_resolution",
  ];

  // Pick the first valid sort field from the browser (only 1 allowed at a time)
  const firstValidSort = Array.isArray(sort)
    ? sort.find(({ field }) => allowedSortFields.includes(field))
    : null;

  const orderBy = firstValidSort
    ? [
        {
          [firstValidSort.field]:
            firstValidSort.direction === "asc" ? "asc" : "desc",
        },
      ]
    : [{ created_at: "desc" }];

  const rolePlayCall = await dailPrisma.role_play_call.findMany({
    orderBy,
    where: {
      ...(canSeeTeamStats ? {} : { user_id: request?.user?.id }),
      tenant_id: request?.user?.tenant?.id ?? "",
      call_end_time: {
        not: null,
      },
      ...(Array.isArray(userIds) &&
        userIds.length > 0 && {
          user_id: { in: canSeeTeamStats ? userIds : [request?.user?.id] },
        }),
      ...(startDate &&
        endDate && {
          created_at: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    },
    select: {
      id: true,
      session_id: true,
      created_at: true,
      updated_at: true,
      call_type: true,
      call_start_time: true,
      call_end_time: true,
      cleaned_transcript: true,
      persona: {
        select: {
          name: true,
          prompt: true,

          // job: true,
          // objection: true,
          // industry: true,
        },
      },
      transcript: true,
      session_closed: true,
      listen_to_talk_ratio: true,
      close_rate: true,
      objection_resolution: true,
    },
  });

  return rolePlayCall;
};

const fetchRecentRolePlayCallAllByUser = async ({ request }) => {
  const { startDate, endDate } = request.body ?? {};
  const canSeeTeamStats = request?.user?.role?.canSeeTeamStats;

  const rolePlayCall = await dailPrisma.role_play_call.groupBy({
    by: ["user_id"],
    where: {
      tenant_id: request?.user?.tenant?.id ?? "",
      call_end_time: { not: null },
      ...(canSeeTeamStats ? {} : { user_id: request?.user?.id }),
      ...(startDate &&
        endDate && {
          created_at: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    },
    _avg: {
      listen_to_talk_ratio: true,
      objection_resolution: true,
    },
    _count: {
      close_rate: true, // counts total where close_rate is NOT null
      id: true, // total calls
    },
  });

  const enrichedData = await Promise.all(
    rolePlayCall.map(async (item) => {
      const user = await dailPrisma.user.findUnique({
        where: { id: item.user_id, is_deleted: false, is_frozen: false },
        select: {
          first_name: true,
          last_name: true,
          id: true,
          email: true,
        },
      });

      return {
        ...item,
        user,
      };
    })
  );

  return enrichedData;
};

export const ROLE_PLAY_CALL_SERVICES = {
  getPreExistingCallOfCallType,
  fetchRecentRolePlayRankedCall,
  createRankedCallWithDefaultRule,
  fetchRecentRolePlayRankedClosedCall,
  createPractiseRankedCallWithSpecifiedPersona,
  fetchRecentRolePlayCallBySession,
  updateRolePlayCallBySession,
  fetchRecentRolePlayCallAll,
  fetchRecentRolePlayCallAllByUser,
};
export default ROLE_PLAY_CALL_SERVICES;
