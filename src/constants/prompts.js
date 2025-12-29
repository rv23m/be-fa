export const TRANSCRIPT_CALL_SUMMARIZE_PROMPTV1 = ({
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
  
    **Transcript:**
    ${formattedTranscript}
  
    **Return JSON Output:** 
    \`\`\`json
    {
      "formatted_transcript": "<The transcript with markdown and highlights>",
    }
    \`\`\`
    `;
};
export const TRANSCRIPT_CALL_SUMMARIZE_PROMPTV2 = ({
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
  // return `
  //   Below is a sales call transcript. Follow these steps:
  //   DO NOT DELETE ANY TRANSCRIPT LINE

  //   **STEP 1:** Format the transcript with markdown. Make **${username}** and **${personaName}** names bold.

  //   **STEP 2:** Highlight key parts:
  //   - **Objections** should be marked as \`[OBJECTION] ... [/OBJECTION]\` (styled pink).
  //   - **Resolutions** should be marked as \`[RESOLUTION] ... [/RESOLUTION]\` (styled green).
  //   - **Qualifying Questions** from ${username} should be marked as \`[QUESTION] ... [/QUESTION]\` (styled blue).

  //   **Transcript:**
  //   ${formattedTranscript}

  //   **Return JSON Output:**
  //   \`\`\`json
  //   {
  //     "formatted_transcript": "<The transcript with markdown and highlights>",
  //   }
  //   \`\`\`
  //   `;

  return `
You are an expert sales conversation analyst.

Your task is to process the following **sales call transcript** step-by-step.  
Do **NOT delete or reorder any line**. Preserve punctuation and speaker names exactly as they appear.

---

### STEP 1 — Markdown Formatting
- Make **${username}** and **${personaName}** names bold wherever they appear as speakers.
- Keep the dialogue structure clear and easy to read.

### STEP 2 — Highlighting Rules

Go through each line and apply the following markup tags.  
**Always identify the speaker first before applying any tag.**

- If the speaker is **${personaName}**, you may apply **ONLY** the following:
  - If ${personaName} expresses a **concern, hesitation, doubt, resistance, or objection** (including risks, budget concerns, uncertainty, or disruption), **even if phrased as a question**, wrap the phrase or sentence with:  
    \`[OBJECTION] ... [/OBJECTION]\`  
  - **Do NOT** apply \`[QUESTION]\` or \`[RESOLUTION]\` to any line spoken by ${personaName}.

- If the speaker is **${username}**, you may apply the following:
  - If ${username} asks a **qualifying or discovery question** (e.g. starts with “How”, “What”, “Would you”, “Can you”, “Do you”), wrap the question with:  
    \`[QUESTION] ... [/QUESTION]\`
  - If ${username} provides an **answer, reassurance, mitigation, or solution** to an objection, wrap the sentence with:  
    \`[RESOLUTION] ... [/RESOLUTION]\`

**Important constraints:**
- A line must **never** be tagged as \`[QUESTION]\` unless it is spoken by **${username}**.
- Any question asked by **${personaName}** must be treated as an \`[OBJECTION]\`, not a \`[QUESTION]\`.

---

### STEP 3 — Output Format
Return **only** valid JSON as shown below.  
Do NOT include any explanation, extra text, or markdown formatting outside the JSON.

\`\`\`json
{
  "formatted_transcript": "<The fully formatted transcript with markdown and highlight tags>"
}
\`\`\`

---

### TRANSCRIPT TO PROCESS:
${formattedTranscript}
`;
};

export const TRANSCRIPT_CALL_SUMMARIZE_PROMPT = ({
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
  // return `
  //   Below is a sales call transcript. Follow these steps:
  //   DO NOT DELETE ANY TRANSCRIPT LINE

  //   **STEP 1:** Format the transcript with markdown. Make **${username}** and **${personaName}** names bold.

  //   **STEP 2:** Highlight key parts:
  //   - **Objections** should be marked as \`[OBJECTION] ... [/OBJECTION]\` (styled pink).
  //   - **Resolutions** should be marked as \`[RESOLUTION] ... [/RESOLUTION]\` (styled green).
  //   - **Qualifying Questions** from ${username} should be marked as \`[QUESTION] ... [/QUESTION]\` (styled blue).

  //   **Transcript:**
  //   ${formattedTranscript}

  //   **Return JSON Output:**
  //   \`\`\`json
  //   {
  //     "formatted_transcript": "<The transcript with markdown and highlights>",
  //   }
  //   \`\`\`
  //   `;

  return `
You are an expert sales conversation analyst.

Your task is to process the following **sales call transcript** step-by-step.  
Do **NOT delete or reorder any line**. Preserve punctuation and speaker names exactly as they appear.

---

### STEP 1 — Markdown Formatting
- Make **${username}** and **${personaName}** names bold wherever they appear as speakers.
- Keep the dialogue structure clear and easy to read.

### STEP 2 — Highlighting Rules

Go through each line and apply the following markup tags.  
**Always identify the speaker first before applying any tag.**

- If the speaker is **${personaName}**, you may apply **ONLY** the following:
  - If ${personaName} expresses a **concern, hesitation, doubt, resistance, or objection** (including risks, budget concerns, uncertainty, or disruption), wrap the phrase or sentence with:  
    \`[OBJECTION] ... [/OBJECTION]\`  
  - **Do NOT** apply \`[QUESTION]\` or \`[RESOLUTION]\` to any line spoken by ${personaName}.

- If the speaker is **${username}**, you may apply the following:
  - If ${username} asks a **qualifying or discovery question** (e.g. starts with “How”, “What”, “Would you”, “Can you”, “Do you”), wrap the question with:  
    \`[QUESTION] ... [/QUESTION]\`
  - If ${username} provides an **answer, reassurance, mitigation, or solution** to an objection, wrap the sentence with:  
    \`[RESOLUTION] ... [/RESOLUTION]\`

**Important constraints:**
- A line must **never** be tagged as \`[QUESTION]\` unless it is spoken by **${username}**.
- Any question asked by **${personaName}** must be treated as an \`[OBJECTION]\`, not a \`[QUESTION]\`.

---

### STEP 3 — Output Format
Return **only** valid JSON as shown below.  
Do NOT include any explanation, extra text, or markdown formatting outside the JSON.

\`\`\`json
{
  "formatted_transcript": "<The fully formatted transcript with markdown and highlight tags>"
}
\`\`\`

---

### TRANSCRIPT TO PROCESS:
${formattedTranscript}
`;
};

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

export const PRACTISE_CALL_SUMMARIZE_PROMPTV1 = ({
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
// export const PRACTISE_CALL_SUMMARIZE_PROMPT = ({
//   username,
//   personaName,
//   formattedTranscript,
// }) => {
//   return `
// You are an expert sales call analyst.

// Below is a sales call transcript between **${username}** (the salesperson) and **${personaName}** (the potential customer).

// Do **NOT** remove or reorder lines. Follow the instructions carefully.

// ---

// ### STEP 1 — Talk Ratio
// Estimate how much each person spoke:
// - Count approximate total **words** spoken by each speaker.
// - Return the ratio as "<${personaName}%>/(<${personaName}%> + <${username}%>)".

// ---

// ### STEP 2 — Objection and Resolution Logic
// Carefully identify **objections** and **resolutions** using these strict rules:

// #### A. Objection Definition
// An *objection* occurs when **${personaName}** expresses:
// - hesitation, concern, fear, or resistance (e.g. "concerns", "budget", "risk", "disruptions", "not sure")
// - requests clarification or expresses doubt about benefits, cost, or fit.

// #### B. Resolution Definition
// A *resolution* counts **only** if **${username}**:
// - directly addresses the *same concern* raised by ${personaName}, **AND**
// - provides a *clear reassurance, solution, measurable claim, or next step* related to it.

// If ${username} merely *acknowledges, jokes, changes the topic, or restates the objection*, it **does not count** as resolved.

// #### C. Calculation
// Compute the **objection resolution percentage** as:
// \`\`\`
// (number of objections that were fully resolved / total number of objections) * 100
// \`\`\`
// Round to the nearest whole number.

// If **no objections** are detected, return "0%".

// ---

// ### STEP 3 — Call Outcome
// Based on ${personaName}'s final statements:
// - If they remain doubtful or raise unresolved concerns → "NO"
// - If they sound convinced or ready to move forward → "YES"

// ---

// ### STEP 4 — Output JSON
// Return only valid JSON (no markdown or comments):

// \`\`\`json
// {
//   "listen_vs_talk_percentage": "<number/number>",
//   "objection_resolution_percentage": "<number>%",
//   "call_booked": "YES" or "NO"
// }
// \`\`\`

// ---

// ### TRANSCRIPT:
// ${formattedTranscript}
// `;
// };

export const PRACTISE_CALL_SUMMARIZE_PROMPT = ({
  username,
  personaName,
  formattedTranscript,
}) => {
  return `
You are an expert sales call analyst.

Below is a sales call transcript between **${username}** (the salesperson) and **${personaName}** (the potential customer).

Do **NOT** remove or reorder lines. Follow the instructions carefully.

---

### STEP 1 — Talk Ratio
Estimate how much each person spoke:
- Count approximate total **words** spoken by ${personaName} return as personaSpokenWords.
- Count approximate total **words** spoken by ${username} return as userSpokenWords.

---

### STEP 2 — Objection and Resolution Logic
Carefully identify **objections** and **resolutions** using these strict rules:

#### A. Objection Definition
An *objection* occurs when **${personaName}** expresses:
- hesitation, concern, fear, or resistance (e.g. "concerns", "budget", "risk", "disruptions", "not sure")
- requests clarification or expresses doubt about benefits, cost, or fit.

#### B. Resolution Definition
A *resolution* counts **only** if **${username}**:
- directly addresses the *same concern* raised by ${personaName}, **AND**
- provides a *clear reassurance, solution, measurable claim, or next step* related to it.

If ${username} merely *acknowledges, jokes, changes the topic, or restates the objection*, it **does not count** as resolved.

#### C. Calculation
Compute the **objection resolution** as:
\`\`\`
number of objections that were fully resolved as objectionsResolved
\`\`\`
\`\`\`
total number of objections as totalObjections
\`\`\`
Round to the nearest whole number.

If **no objections** are detected, return "0%".

---

### STEP 3 — Call Outcome
Based on ${personaName}'s final statements:
- If they remain doubtful or raise unresolved concerns → "NO"
- If they sound convinced or ready to move forward → "YES"

---

### STEP 4 — Output JSON
Return only valid JSON (no markdown or comments):

\`\`\`json
{
  "personaSpokenWords": "<number>",
  "userSpokenWords": "<number>",
  "objectionsResolved": "<number>",
  "totalObjections": "<number>",
  "call_booked": "YES" or "NO"
}
\`\`\`

---

### TRANSCRIPT:
${formattedTranscript}
`;
};
