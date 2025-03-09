import { dailPrisma } from "../plugins/prisma.js";

const getAllCallType = async () => {
  const callTypes = await dailPrisma.call_type.findMany({});
  return callTypes;
};

const getRankedCallType = async () => {
  const callTypes = await dailPrisma.call_type.findFirst({
    where: { name: "ranked" },
  });
  return callTypes;
};

const getPractiseCallType = async () => {
  const callTypes = await dailPrisma.call_type.findFirst({
    where: { name: "practise" },
  });
  return callTypes;
};

export const CALL_TYPE_SERVICE = {
  getAllCallType,
  getRankedCallType,
  getPractiseCallType,
};
export default CALL_TYPE_SERVICE;
