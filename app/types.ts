export const delimiter = "_|_";

// survey[delimiter][surveyName]
type SurveyId = string;
export type Survey = {
  name: string;
};
export const surveysKey = "surveys";
export const getSurveyKey = (surveyName: string) =>
  `survey${delimiter}${surveyName}`;

// [SurveyId][delimiter]options
export type OptionsId = string;
export type Options = Option[];
export type Option = { name: string };
export const getOptionsKey = (surveyName: string) =>
  `${getSurveyKey(surveyName)}${delimiter}options`;

// [SurveyId][delimiter][userName][delimiter]votes
export type VoteIds = string;
export type Votes = Vote[];
export type Vote = {
  userName: string;
  option: Option;
  value: VoteValue | null;
};
// export type VoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type VoteValue = number;
export const getVotesKey = (
  surveyName: string,
  userName: string,
  optionName: string
) =>
  `${getSurveyKey(
    surveyName
  )}${delimiter}${userName}${delimiter}votes${delimiter}${optionName} `;

// [SurveyId][delimiter]users
export type SurveyUsersId = string;
export type SurveyUser = { name: string };
export const getSurveyUsersKey = (surveyName: string) =>
  `${getSurveyKey(surveyName)}${delimiter}users`;

export type ServerResponse<T = undefined> =
  | {
      ok: true;
      data: T;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export type Results = {
  votes: Vote[];
  users: SurveyUser[];
  options: Option[];
};
