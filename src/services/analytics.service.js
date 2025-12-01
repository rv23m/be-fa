import { dailPrisma } from "../plugins/prisma.js";

const ANALYTICS_EVENT_TYPES = {
  CLICK_ROLE_PLAY: "CLICK_ROLE_PLAY",
  CLICK_LEADERBOARD: "CLICK_LEADERBOARD",
  CLICK_STATS_METRICS: "CLICK_STATS_METRICS",
  CLICK_STATS_CALL_LOGS: "CLICK_STATS_CALL_LOGS",
  CLICK_PERSONAS: "CLICK_PERSONAS",
  LOGIN: "LOGIN",
  ROLE_PLAY_CALL_SESSIONS: "ROLE_PLAY_CALL_SESSIONS",
};

async function createAnalytics({ req, eventType, data }) {
  const tenant = await dailPrisma.analytics.create({
    data: {
      event_type: eventType,
      user_id: req?.user?.id,
      tenant_id: req?.user?.tenant?.id,
      data: { ...(data || {}) },
    },
  });

  return tenant;
}

async function getAnalyticsByUser({ req }) {
  const tenantId = req?.tenant?.id;

  const result = await dailPrisma.$runCommandRaw({
    aggregate: "analytics",
    pipeline: [
      {
        $match: {
          tenant_id: { $oid: tenantId },
        },
      },

      {
        $facet: {
          // 1️⃣ USER-LEVEL ANALYTICS
          user_stats: [
            {
              $group: {
                _id: "$user_id",
                click_role_play: {
                  $sum: {
                    $cond: [{ $eq: ["$event_type", "CLICK_ROLE_PLAY"] }, 1, 0],
                  },
                },
                click_leaderboard: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_LEADERBOARD"] },
                      1,
                      0,
                    ],
                  },
                },
                click_stats_metrics: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_STATS_METRICS"] },
                      1,
                      0,
                    ],
                  },
                },
                click_stats_call_logs: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_STATS_CALL_LOGS"] },
                      1,
                      0,
                    ],
                  },
                },
                click_personas: {
                  $sum: {
                    $cond: [{ $eq: ["$event_type", "CLICK_PERSONAS"] }, 1, 0],
                  },
                },
                last_login: {
                  $max: {
                    $cond: [
                      { $eq: ["$event_type", "LOGIN"] },
                      "$created_at",
                      null,
                    ],
                  },
                },
                total_tokens: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "ROLE_PLAY_CALL_SESSIONS"] },
                      { $ifNull: ["$data.response.usage.total_tokens", 0] },
                      0,
                    ],
                  },
                },
                conversation_ids: {
                  $addToSet: {
                    $cond: [
                      { $eq: ["$event_type", "ROLE_PLAY_CALL_SESSIONS"] },
                      "$data.response.conversation_id",
                      "$$REMOVE",
                    ],
                  },
                },
              },
            },
            // Lookup user details
            {
              $lookup: {
                from: "user", // name of your users collection
                localField: "_id", // user_id from analytics
                foreignField: "_id", // _id in users collection
                as: "user_details",
              },
            },
            // Unwind so user_details is an object instead of array
            {
              $unwind: {
                path: "$user_details",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                user_id: "$_id",
                click_role_play: 1,
                click_leaderboard: 1,
                click_stats_metrics: 1,
                click_stats_call_logs: 1,
                click_personas: 1,
                last_login: 1,
                total_tokens: 1,
                distinct_conversation_count: { $size: "$conversation_ids" },
                user_details: {
                  id: 1,
                  first_name: 1,
                  last_name: 1,
                  email: 1,
                }, // contains user info like name, email, etc.
              },
            },
          ],

          // 2️⃣ TENANT TOTALS (unchanged)
          tenant_totals: [
            {
              $group: {
                _id: null,
                total_click_role_play: {
                  $sum: {
                    $cond: [{ $eq: ["$event_type", "CLICK_ROLE_PLAY"] }, 1, 0],
                  },
                },
                total_click_leaderboard: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_LEADERBOARD"] },
                      1,
                      0,
                    ],
                  },
                },
                total_click_stats_metrics: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_STATS_METRICS"] },
                      1,
                      0,
                    ],
                  },
                },
                total_click_stats_call_logs: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "CLICK_STATS_CALL_LOGS"] },
                      1,
                      0,
                    ],
                  },
                },
                total_click_personas: {
                  $sum: {
                    $cond: [{ $eq: ["$event_type", "CLICK_PERSONAS"] }, 1, 0],
                  },
                },
                total_role_play_sessions: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "ROLE_PLAY_CALL_SESSIONS"] },
                      1,
                      0,
                    ],
                  },
                },
                total_tokens: {
                  $sum: {
                    $cond: [
                      { $eq: ["$event_type", "ROLE_PLAY_CALL_SESSIONS"] },
                      { $ifNull: ["$data.response.usage.total_tokens", 0] },
                      0,
                    ],
                  },
                },
                all_conversations: {
                  $addToSet: {
                    $cond: [
                      { $eq: ["$event_type", "ROLE_PLAY_CALL_SESSIONS"] },
                      "$data.response.conversation_id",
                      "$$REMOVE",
                    ],
                  },
                },
                last_login: {
                  $max: {
                    $cond: [
                      { $eq: ["$event_type", "LOGIN"] },
                      "$created_at",
                      null,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                total_click_role_play: 1,
                total_click_leaderboard: 1,
                total_click_stats_metrics: 1,
                total_click_stats_call_logs: 1,
                total_click_personas: 1,
                total_role_play_sessions: 1,
                total_tokens: 1,
                last_login: 1,
                distinct_conversation_count: { $size: "$all_conversations" },
              },
            },
          ],
        },
      },
    ],
    cursor: { batchSize: 2 },
  });

  return result;
}

export const ANALYTICS_SERVICE = {
  createAnalytics,
  ANALYTICS_EVENT_TYPES,
  getAnalyticsByUser,
};
export default ANALYTICS_SERVICE;
