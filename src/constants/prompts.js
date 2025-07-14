export const RANKED_CALL_SUMMARIZE_PROMPT = ({
  username,
  personaName,
  formattedTranscript,
}) => {
  /**
   * keep the percentage more accurate like 8%, 18%, and like that not just 89% like that choose all numbers so that average is not close to 50% immediately i want atleast 1 user to get 100 calls before hitting 50% average.
   *
   * instead of asking AI to judge the context
   * - ask ai in a strict questions
   * - for example : ask ai for Probability(listen) (try in units of number of words)
   * - for example : ask ai for Probability(talk)
   * - for example : ask ai for Probability(objections) {questions asked by ai}
   * - for example : ask ai for Probability(resolutions) {number of answers provided to those question on a satisfaction level of 5 on a scale of 0-5}
   */
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
      "formatted_transcript": "<The transcript with markdown and highlights>",
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
      

      **STEP 1:** Provide insights:
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
