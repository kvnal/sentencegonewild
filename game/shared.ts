export type Page =
  | "home"
  | "pokemon";

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
