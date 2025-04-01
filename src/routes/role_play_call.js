import {
  PRACTISE_CALL_SUMMARIZE_PROMPT,
  RANKED_CALL_SUMMARIZE_PROMPT,
} from "../constants/prompts.js";
import CALL_TYPE_SERVICE from "../services/call_type.service.js";
import ROLE_PLAY_CALL_SERVICES from "../services/role_play_call.service.js";
import ResponseFormat from "../utils/response_format.js";
import OpenAI from "openai";

const ROUTE_LEVEL_IDENTIFIER = "role-play-call";
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const openai = new OpenAI({
    apiKey: fastify.config.OPENAI_API_KEY, // Load API key from .env
  });

  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}`,
    // { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      console.log(request.user);
      return { message: "OK" };
    }
  );

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/session`,
    // { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { call_type_id } = request.query;

      const preExistingCall =
        await ROLE_PLAY_CALL_SERVICES.getPreExistingCallOfCallType({
          request,
          call_type_id,
        });

      if (preExistingCall) {
        ResponseFormat[200]({
          reply,
          data: { role_play_call: preExistingCall },
        });
        return reply;
      }

      const call_type = await CALL_TYPE_SERVICE.getAllCallType();
      const call_type_practice = call_type?.find((e) =>
        e?.name?.includes("practise")
      );
      const call_type_ranked = call_type?.find((e) =>
        e?.name?.includes("ranked")
      );
      if (call_type_id === call_type_practice?.id) {
        const latestRolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayRankedCall({
            request,
          });

        if (latestRolePlayCall) {
          const newRolePlayCall =
            await ROLE_PLAY_CALL_SERVICES.createPractiseRankedCallWithSpecifiedPersona(
              { request, persona_id: latestRolePlayCall?.persona_id }
            );

          ResponseFormat[200]({
            reply,
            data: {
              role_play_call: newRolePlayCall,
            },
          });
          return reply;
        } else {
          const newRankedRolePlayCall =
            await ROLE_PLAY_CALL_SERVICES.createRankedCallWithDefaultRule({
              request,
              reply,
            });
          const newRolePlayCall =
            await ROLE_PLAY_CALL_SERVICES.createPractiseRankedCallWithSpecifiedPersona(
              { request, persona_id: newRankedRolePlayCall?.persona_id }
            );

          ResponseFormat[200]({
            reply,
            data: {
              role_play_call: newRolePlayCall,
            },
          });
          return reply;
        }
      } else if (call_type_id === call_type_ranked?.id) {
        const newRolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.createRankedCallWithDefaultRule({
            request,
            reply,
          });

        ResponseFormat[200]({
          reply,
          data: {
            role_play_call: newRolePlayCall,
          },
        });
        return reply;
      }
    }
  );

  fastify.get(
    `/${ROUTE_LEVEL_IDENTIFIER}/session/:id`,
    async (request, reply) => {
      const { id } = request.params; // Extract the `id` from the URL

      const rolePlayCall =
        await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayCallBySession({
          request,
          session_id: id,
        });

      delete rolePlayCall?.transcript;

      ResponseFormat[200]({
        reply,
        data: {
          role_play_call: rolePlayCall,
        },
      });
      return reply;
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/session/start/:id`,
    async (request, reply) => {
      const { id } = request.params; // Extract the `id` from the URL

      const rolePlayCall =
        await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayCallBySession({
          request,
          session_id: id,
        });

      if (rolePlayCall?.session_closed) {
        ResponseFormat[200]({
          reply,
          data: {
            role_play_call: rolePlayCall,
          },
        });
        return reply;
      }

      const rolePlayPrompt = `You are role playing as a potential sales lead that is being sold a product. There are 2 role plays practise and ranked (marked for evaluation). This is ${rolePlayCall?.call_type?.prompt_name}. Here are some instructions: - Do not narrate what you are doing - Your name is ${rolePlayCall?.persona?.name?.prompt_name}- Your role is [${rolePlayCall?.persona?.job?.prompt_job}] - Your industry is [${rolePlayCall?.persona?.industry?.prompt_industry}]- Your objection is [${rolePlayCall?.persona?.objection?.prompt_objection}]`;
      const systemPrompt = {
        role: "system",
        content: rolePlayPrompt,
        created_at: new Date().toISOString(),
      };

      const transcript = rolePlayCall?.transcript;

      if (!transcript?.length) {
        transcript.push(systemPrompt);
      }

      const updatedRolePlayCall =
        await ROLE_PLAY_CALL_SERVICES.updateRolePlayCallBySession({
          request,
          session_id: id,
          data: {
            transcript,
            call_start_time: new Date(),
          },
        });

      ResponseFormat[200]({
        reply,
        data: {
          role_play_call: updatedRolePlayCall,
        },
      });

      return reply;
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/session/talk/:id`,
    async (request, reply) => {
      console.time("total");

      const { id } = request.params; // Extract the `id` from the URL

      const userMessage = request?.body?.userMessage;

      if (!userMessage) {
        ResponseFormat[400]({
          reply,
          message: "Message is required.",
        });
        return reply;
      }

      try {
        // Send request to OpenAI API with Taylor Morgan's role and user's message
        // OpenAI API call
        console.time("rolePlayCall");
        const rolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayCallBySession({
            request,
            session_id: id,
          });
        console.timeEnd("rolePlayCall");
        if (rolePlayCall?.session_closed) {
          ResponseFormat[200]({
            reply,
            data: {
              talk_transaction: "The call has already ended",
            },
          });
          return reply;
        }

        const newChat = {
          role: "user",
          content: userMessage,
          created_at: new Date().toISOString(),
        };

        // console.log("##", rolePlayCall?.transcript);
        console.time("OpenAI API Call");
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [...(rolePlayCall?.transcript || []), newChat],
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.timeEnd("OpenAI API Call");
        // console.log("##", response);

        const newChatResponse = {
          ...response.choices[0].message,
          created_at: new Date().toISOString(),
        };
        console.time("updatedRolePlayCall");
        const updatedRolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.updateRolePlayCallBySession({
            request,
            session_id: id,
            data: {
              transcript: [
                ...rolePlayCall?.transcript,
                newChat,
                newChatResponse,
              ],
            },
          });
        console.timeEnd("updatedRolePlayCall");

        ResponseFormat[200]({
          reply,
          data: {
            talk_transaction: updatedRolePlayCall?.transcript?.pop(),
          },
        });
        console.timeEnd("total");

        return reply;
      } catch (error) {
        console.error("Error with OpenAI API:", error?.message, error);
        ResponseFormat[400]({
          reply,
          message: error?.message,
        });
        return reply;
      }
    }
  );

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/session/talk/v2/:id`,
    async (request, reply) => {
      const { id } = request.params;
      const userMessage = request?.body?.userMessage;
      console.log("userMessage ##", userMessage);

      if (!userMessage) {
        ResponseFormat[400]({ reply, message: "Message is required." });
        return reply;
      }

      try {
        const rolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayCallBySession({
            request,
            session_id: id,
          });

        if (!rolePlayCall || rolePlayCall?.session_closed) {
          ResponseFormat[200]({
            reply,
            data: { talk_transaction: "The call has already ended" },
          });
          return reply;
        }

        const newChat = {
          role: "user",
          content: userMessage,
          created_at: new Date().toISOString(),
        };

        reply
          .header("Access-Control-Allow-Origin", "*") // 🔥 Allow CORS
          .header("Access-Control-Allow-Credentials", "true") // 🔥 Allow credentials
          .header("Access-Control-Expose-Headers", "Content-Type") // 🔥 Expose headers
          .header("Content-Type", "text/event-stream")
          .header("Cache-Control", "no-cache")
          .header("Connection", "keep-alive");

        const openaiStream = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [...(rolePlayCall?.transcript || []), newChat],
          temperature: 1,
          max_tokens: 2048,
          stream: true, // Enable streaming
        });

        let fullMessage = "";
        for await (const chunk of openaiStream) {
          const token = chunk.choices?.[0]?.delta?.content || "";
          fullMessage += token;
          reply.raw.write(token);
        }

        const newChatResponse = {
          role: "assistant",
          content: fullMessage,
          created_at: new Date().toISOString(),
        };

        await ROLE_PLAY_CALL_SERVICES.updateRolePlayCallBySession({
          request,
          session_id: id,
          data: {
            transcript: [...rolePlayCall?.transcript, newChat, newChatResponse],
          },
        });

        reply.raw.end();
      } catch (error) {
        console.error("Error:", error);
        reply.raw.write("Error occurred");
        reply.raw.end();
      }
    }
  );

  const formatTranscript = ({ transcript, username, aiPersonaName }) => {
    return (
      `**human is ${username}**
      **AI persona is ${aiPersonaName}**
      ` +
      "\n\n" +
      transcript
        .map((msg) => {
          if (msg.role === "user") {
            return `**${username}**: ${msg.content}`;
          } else if (msg.role === "assistant") {
            return `**${aiPersonaName}**: ${msg.content}`;
          } else {
            return "";
          }
        })
        .join("\n\n")
    );
  };

  const parseToJson = (inputString) => {
    try {
      // Remove potential escape characters (\n, etc.)
      const cleanedString = inputString.replace(/\n/g, "");

      // Parse into JSON
      const jsonObject = JSON.parse(cleanedString);

      return jsonObject;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  fastify.post(
    `/${ROUTE_LEVEL_IDENTIFIER}/session/end/:id`,
    async (request, reply) => {
      const { id } = request.params; // Extract the `id` from the URL

      try {
        // Send request to OpenAI API with Taylor Morgan's role and user's message
        // OpenAI API call

        const rolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.fetchRecentRolePlayCallBySession({
            request,
            session_id: id,
          });

        if (rolePlayCall?.session_closed) {
          ResponseFormat[200]({
            reply,
            data: {
              role_play_call: rolePlayCall,
            },
          });
          return reply;
        }

        const transcript = rolePlayCall?.transcript;
        const username = `${request?.user?.first_name} ${request?.user?.last_name}`;
        const personaName = rolePlayCall?.persona?.name?.prompt_name;

        const formattedTranscript = formatTranscript({
          transcript,
          username: username,
          aiPersonaName: personaName,
        });

        const isCallRanked = rolePlayCall?.call_type?.name === "ranked";

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an AI call analysis assistant. Always respond in valid JSON format.",
            },
            {
              role: "user",
              content: isCallRanked
                ? RANKED_CALL_SUMMARIZE_PROMPT({
                    username,
                    personaName,
                    formattedTranscript,
                  })
                : PRACTISE_CALL_SUMMARIZE_PROMPT({
                    username,
                    personaName,
                    formattedTranscript,
                  }),
            },
          ],
          temperature: 1,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            type: "json_object",
          }, // Ensures JSON response format
        });
        const formattedResponse = parseToJson(
          response?.choices?.[0]?.message?.content
        );

        const updatedRolePlayCall =
          await ROLE_PLAY_CALL_SERVICES.updateRolePlayCallBySession({
            request,
            session_id: id,
            data: {
              ...(isCallRanked
                ? {
                    cleaned_transcript: formattedResponse?.formatted_transcript,
                  }
                : {}),
              listen_to_talk_ratio: parseFloat(
                formattedResponse?.listen_vs_talk_percentage
              ),
              objection_resolution: parseFloat(
                formattedResponse?.objection_resolution_percentage
              ),
              close_rate: formattedResponse?.call_booked === "YES",
              call_end_time: new Date(),
              session_closed: true,
            },
          });

        ResponseFormat[200]({
          reply,
          data: {
            role_play_call: updatedRolePlayCall,
          },
        });
        return reply;
      } catch (error) {
        console.error("Error with OpenAI API:", error?.message, error);
        ResponseFormat[400]({
          reply,
          message: error?.message,
        });
        return reply;
      }
    }
  );
}

//ESM
export default routes;
