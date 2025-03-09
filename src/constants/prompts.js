export const RANKED_CALL_SUMMARIZE_PROMPT = ({
  username,
  personaName,
  formattedTranscript,
}) => {
  return `
    Below is a sales call transcript. Follow these steps:
    DO NOT DELETE ANY TRANSCRIPT LINE
    
    **STEP 1:** Format the transcript with markdown. Make **${username}** and **${personaName}** names bold.
  
    **STEP 2:** Highlight key parts:
    - **Objections** should be marked as \`[OBJECTION] ... [/OBJECTION]\` (styled pink).
    - **Resolutions** should be marked as \`[RESOLUTION] ... [/RESOLUTION]\` (styled green).
    - **Qualifying Questions** from ${username} should be marked as \`[QUESTION] ... [/QUESTION]\` (styled blue).
  
    **STEP 3:** Provide insights:
    - **Listen vs Talk percentage** (${username} vs ${personaName} talk ratio).
    - **Objection Resolution percentage** (How many objections were resolved).
    - **Call Outcome**: Is the customer likely to book the service? Answer with "YES" or "NO" based on their responses.
  
    **Transcript:**
    ${formattedTranscript}
  
    **Return JSON Output:** 
    \`\`\`json
    {
      "formatted_transcript": "The transcript with markdown and highlights",
      "listen_vs_talk_percentage": "<calculate by analysing transcript>%", // (** listen_vs_talk percentage of ${username})
      "objection_resolution_percentage": "<calculate by analysing transcript>%",
      "call_booked": "YES" or "NO"
    }
    \`\`\`
    `;
};

export const PRACTISE_CALL_SUMMARIZE_PROMPT = ({
  username,
  personaName,
  formattedTranscript,
}) => {
  return `
      Below is a sales call transcript. Follow these steps:
      DO NOT DELETE ANY TRANSCRIPT LINE
      

      **STEP 2:** Provide insights:
      - **Listen vs Talk percentage** (${username} vs ${personaName} talk ratio).
      - **Objection Resolution percentage** (How many objections were resolved).
      - **Call Outcome**: Is the customer likely to book the service? Answer with "YES" or "NO" based on their responses.
    
      **Transcript:**
      ${formattedTranscript}
    
      **Return JSON Output:** 
      \`\`\`json
      {
        "listen_vs_talk_percentage": "<calculate by analysing transcript>%", // (** listen_vs_talk percentage of ${username})
        "objection_resolution_percentage": "<calculate by analysing transcript>%",
        "call_booked": "YES" or "NO"
      }
      \`\`\`
      `;
};
