/*
 * Thing Identifiers
 */

export type CommentId = `t1_${string}`;
export type UserId = `t2_${string}`;
export type PostId = `t3_${string}`;
export type SubredditId = `t5_${string}`;

/*
 * Our Post Types
 */
export enum PostType {
  WILDSENTENCE = "wildsentence",
  PINNED = "pinnedhome",
}

export interface PostHStorage {
  postId: PostId;
  postType: PostType;
}

export type Page =
  | "home" // Answer input page
  | "create_sentence"
  | "help"
  | "leaderboard";

export type WebviewToBlockMessage =
  | { type: "INIT" }
  | {
      type: "SUBMIT";
      payload: { postId: string; completedSentence: string };
    }
  | {
      type: "SUBMIT_SENTENCE";
      payload: { newSentence: string };
    };

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: BlocksToWebviewPayload;
};

export type BlocksToWebviewPayload =
  | SentenceData
  | CreatePageData
  | HelpData
  | LeaderboardData;
// | {
//   type: "GET_POKEMON_RESPONSE";
//   payload: { number: number; name: string; error?: string };
// };

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export type SentenceData = {
  page: Page;
  postId: PostId;
  incompleteSentence: string;
};

export type TopWildComment = {
  username: string;
  score: number;
  wildComment: string;
}

export type CreatePageData = {
  page: Page;
};

export type HelpData = {
  page: Page;
};

export type LeaderboardData = {
  page: Page;
  leaderboard: LeaderboardScore[];
};

export type RUsername = string;

export type LeaderboardScore = {
  username: string;
  score: number;
  rank: number;
};

export interface SentenceEntry {
  id: number;
  sentence: string;
}

export interface SentenceDataCollection {
  all: SentenceEntry[];
}

export interface IRedisPostData {
  [postId: string]: string;
}

export interface IRedisUsedSentence {
  [postId: string]: "true";
}
