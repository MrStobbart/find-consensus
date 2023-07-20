import { kv } from "@vercel/kv";
import {
  Option,
  Survey,
  SurveyUser,
  Vote,
  getOptionsKey,
  getSurveyUsersKey,
  getVotesKey,
  surveysKey,
} from "../types";

export const getVotes = async (
  surveyName: string,
  userName: string
): Promise<Vote[]> => {
  const options = await getOptions(surveyName);
  const votesKeys = options.map(({ name }) =>
    getVotesKey(surveyName, userName, name)
  );
  const votes = await kv.mget<number[]>(...votesKeys);

  return options.map(({ name }, index) => ({
    optionName: name,
    value: votes[index],
  }));
};

export const getVotesForOption = async (
  surveyName: string,
  userName: string,
  optionName: string
) => {
  const votes = await getVotes(surveyName, userName);
  return votes.filter((vote) => vote.optionName === optionName);
};

export const getUsers = async (surveyName: string) => {
  const users = await kv.lrange<SurveyUser>(
    getSurveyUsersKey(surveyName),
    0,
    -1
  );
  return users.reverse();
};

export const getOptions = async (surveyName: string) => {
  const options = await kv.lrange<Option>(getOptionsKey(surveyName), 0, -1);
  return options.reverse();
};

export const getSurveys = async () => {
  const surveys = await kv.lrange<Survey>(surveysKey, -20, -1);
  return surveys.reverse();
};
