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

export const getVotes = async (surveyName: string, userName: string) => {
  const votes = await kv.lrange<Vote>(getVotesKey(surveyName, userName), 0, -1);
  return votes.reverse();
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
