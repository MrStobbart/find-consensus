// In Memory "db"

// TODO I could also use hashes for ids. Is probably smarter

const delimiter = "_|_";

// survey[delimiter][surveyName]
type SurveyId = string;
export type Survey = {
  id: SurveyId;
  name: string;
  options: OptionId[];
  users: UserId[];
};

export type SurveyIds = SurveyId[];

// option[delimiter][survey][delimiter][optionName]
type OptionId = string;
export type Option = { id: OptionId; name: string; votes: VoteId[] };
export type OptionIds = OptionId[];

// vote[delimiter][survey][delimiter][option][delimiter][userName]
type VoteId = string;
export type Vote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type VoteIds = VoteId[];

// user[userName]
type UserId = string;
export type User = { id: UserId; name: string };
export type UserIds = UserId[];

export const surveyIds: SurveyIds = [];
export const surveys: Record<SurveyId, Survey> = {};

export const optionIds: OptionIds = [];
export const options: Record<OptionId, Option> = {};

export const voteIds: VoteIds = [];
export const votes: Record<VoteId, Vote> = {};

export const userIds: UserIds = [];
export const users: Record<UserId, User> = {};
