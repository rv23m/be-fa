import {
  CHARACTER_NAMES,
  SYSTEM_PROMPTS,
} from "../constants/systemPrompts.constants.js";

const generateSystemPrompt = (
  position,
  industry,
  defaultObjection,
  scenario = null
) => {
  //   const randomIndex = Math.floor(Math.random() * SYSTEM_PROMPTS.length);
  //   return SYSTEM_PROMPTS?.[randomIndex]?.trim();
  const randomIndex = Math.floor(Math.random() * SYSTEM_PROMPTS.length);
  const template = SYSTEM_PROMPTS[randomIndex];

  // Turn string into a template literal
  const fn = new Function(
    "position",
    "industry",
    "defaultObjection",
    "scenario",
    `return \`${template}\`;`
  );

  return fn(position, industry, defaultObjection, scenario);
};

const generateNames = () => {
  const randomIndex = Math.floor(Math.random() * CHARACTER_NAMES.length);

  return CHARACTER_NAMES[randomIndex];
};

export const PERSONA_UTIL = {
  generateSystemPrompt,
  generateNames,
};
