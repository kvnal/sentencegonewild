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
  WILDSENTENCE = 'wildsentence',
  PINNED = 'pinnedhome',
}

export interface PostHStorage{
  postId: PostId;
  postType: PostType;
}

export type Page =
  | "home";

export type WebviewToBlockMessage = { type: "INIT" } | {
  type: "SUBMIT";
  payload: { postId: string , completedSentence: string };
};

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: SentenceData;
};
// | {
//   type: "GET_POKEMON_RESPONSE";
//   payload: { number: number; name: string; error?: string };
// };

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export type SentenceData = {
  postId: string;
  incompleteSentence: string;
}


export interface SentenceEntry {
  id: number;
  sentence: string;
}

export interface SentenceDataCollection {
  all: SentenceEntry[];
}

export interface IRedisPostData {
  [postId : string] : string
}

export interface IRedisUsedSentence {
  [postId : string] : "true"
}