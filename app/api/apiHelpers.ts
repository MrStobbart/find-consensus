import { kv } from "@vercel/kv";
import {
  Option,
  Results,
  Survey,
  SurveyUser,
  Vote,
  getOptionsKey,
  getSurveyUsersKey,
  getVotesKey,
  surveysKey,
} from "../types";

async function safeMget<T>(keys: string[]) {
  if (keys.length === 0) return [];
  return kv.mget<T[]>(...keys);
}

// All options with votes for the user
export const getVotesForUser = async (
  surveyName: string,
  userName: string
): Promise<Vote[]> => {
  const options = await getOptions(surveyName);
  const votesKeys = options.map(({ name }) =>
    getVotesKey(surveyName, userName, name)
  );
  const votes = await safeMget<number>(votesKeys);

  return options.map((option, index) => ({
    userName,
    option,
    value: votes[index],
  }));
};

export const getResults = async (surveyName: string): Promise<Results> => {
  const [users, options] = await Promise.all([
    getUsers(surveyName),
    getOptions(surveyName),
  ]);
  const votesKeys = users.flatMap((user) =>
    options.map((option) => ({
      votesKey: getVotesKey(surveyName, user.name, option.name),
      userName: user.name,
      option,
    }))
  );

  const votes = await safeMget<number>(
    votesKeys.map(({ votesKey }) => votesKey)
  );

  return {
    users,
    options,
    votes: votesKeys.map(({ userName, option }, index) => ({
      userName: userName,
      option,
      value: votes[index],
    })),
  };
};

export const getVotesForOption = async (
  surveyName: string,
  userName: string,
  optionName: string
) => {
  const votes = await getVotesForUser(surveyName, userName);
  return votes.filter((vote) => vote.option.name === optionName);
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
