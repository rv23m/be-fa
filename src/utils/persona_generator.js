import {
  CHARACTER_NAMES,
  GPT_MOODS,
  SYSTEM_PROMPTS,
  SYSTEM_PROMPTS_V1,
} from "../constants/systemPrompts.constants.js";

const generateSystemPrompt = (
  name,
  position,
  industry,
  defaultObjection,
  scenario = null
) => {
  // const randomIndex = Math.floor(Math.random() * SYSTEM_PROMPTS.length);
  // const template = SYSTEM_PROMPTS[randomIndex];

  // // Turn string into a template literal
  // const fn = new Function(
  //   "position",
  //   "industry",
  //   "defaultObjection",
  //   "scenario",
  //   `return \`${template}\`;`
  // );

  return SYSTEM_PROMPTS_V1(
    name,
    position,
    industry,
    generateMood(),
    defaultObjection
  );
};

const generateNames = ({ preExistingNames = [] }) => {
  const finalArrayWithoutDuplicates = CHARACTER_NAMES.filter(
    (e) => !preExistingNames?.includes(e)
  );

  const randomIndex = Math.floor(
    Math.random() * finalArrayWithoutDuplicates.length
  );

  return finalArrayWithoutDuplicates[randomIndex];
  // const randomIndex = Math.floor(Math.random() * CHARACTER_NAMES.length);

  // return CHARACTER_NAMES[randomIndex];
};

const generateMood = () => {
  const randomIndex = Math.floor(Math.random() * GPT_MOODS.length);

  return GPT_MOODS[randomIndex];
};

export const PERSONA_UTIL = {
  generateSystemPrompt,
  generateNames,
};
