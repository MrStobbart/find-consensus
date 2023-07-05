export type User = {
  name: string;
};

export type Survey = {
  name: string;
  options: Option[];
};

export type Option = {
  name: string;
  votes: Votes;
};

export type userName = string;
export type Votes = Record<userName, Vote>;

export type Vote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ServerResponse<T = undefined> =
  | {
      successful: true;
      data: T;
      message: string;
    }
  | {
      successful: false;
      message: string;
    };
