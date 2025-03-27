import { TopWildComment } from "./../../game/shared.js";
import { Devvit, JobContext, Post } from "@devvit/public-api";
import {
  IRedisPostData,
  IRedisUsedSentence,
  PostHStorage,
  PostId,
  PostType,
  SentenceEntry,
} from "../../game/shared.js";
import { redisKey, postKey, jobKey } from "./keys.js";
import { DEV_COMMENT } from "../actions/actions.js";

export const getPostType = async (context: Devvit.Context, postId: PostId) => {
  const key = postKey.postData(postId);
  const postType = (await context.redis.hGet(key, "postType")) as PostType;
  const defaultPostType: PostType = PostType.WILDSENTENCE;
  return (postType ?? defaultPostType) as PostType;
};

export const savePinnedPost = async (
  context: Devvit.Context,
  postId: PostId
): Promise<void> => {
  const key = postKey.postData(postId);
  const storedType: PostHStorage = {
    postId,
    postType: PostType.PINNED,
  };
  await context.redis.hSet(
    key,
    storedType as unknown as Record<string, string>
  );
};

export const saveWildSentencePost = async (
  context: Devvit.Context | JobContext,
  postId: PostId
): Promise<void> => {
  const key = postKey.postData(postId);
  const storedType: PostHStorage = {
    postId,
    postType: PostType.WILDSENTENCE,
  };
  await context.redis.hSet(
    key,
    storedType as unknown as Record<string, string>
  );
};

export const getUsername = async (context: Devvit.Context) => {
  console.log(context.userId);
  if (!context.userId) return null; // Return early if no userId
  const user = await context.reddit.getCurrentUsername();
  console.log(JSON.stringify(user, null, 2));
  if (user) {
    return user;
  }
  return null;
};

export const incPostCountByOne = async (
  context: Devvit.Context | JobContext
) => {
  const { redis } = context;
  let totalPostCount = await redis.incrBy(redisKey.totalSentencePostCount, 1);
  console.log("post count", totalPostCount);
  return totalPostCount;
};

export const savePostedSentenceInfo = async (
  context: Devvit.Context | JobContext,
  sentence: SentenceEntry,
  post: Post
) => {
  const { redis } = context;

  // save the used sentence id
  let data: IRedisUsedSentence = {};
  data[sentence.id] = "true";

  await redis.hSet(redisKey.GameSentence, data);

  // save the created post: postid -> sentence
  let postData: IRedisPostData = {};
  postData[post.id] = sentence.sentence;

  await redis.hSet(redisKey.postSentence, postData);

  return 1;
};

export const checkSentenceAlreadyCreated = async (
  context: Devvit.Context | JobContext,
  sentenceId: string
) => {
  const { redis } = context;
  const isUsed = await redis.hGet(redisKey.GameSentence, sentenceId);

  if (!isUsed) return false;

  // exists
  return true;
};

export const getPostSentence = async (
  context: Devvit.Context | JobContext,
  postId: string
) => {
  const { redis } = context;
  const sentence = await redis.hGet(redisKey.postSentence, postId);

  // exists
  return sentence;
};

export const getLeaderboard = async (
  context: Devvit.Context | JobContext,
  tillCount: number
) => {
  const { redis } = context;

  let scores = await redis.zRange(redisKey.leaderboard, 0, tillCount, {
    by: "rank",
    reverse: true,
  });

  return scores;
};

export const incrUserLeaderboardScore = async (
  context: Devvit.Context | JobContext,
  increaseBy: number,
  setUsername: string | null = null
) => {
  let username = null;

  if (setUsername) {
    //force setUsername param
    username = setUsername;
    console.log("force set username ", username);
  }

  if (username === null && context.userId != undefined) {
    try {
      let u = await context.reddit.getCurrentUser();
      username = u?.username;
      console.log("get context username ", username);
    } catch (e) {
      username = null;
    }
  }

  if (!username) return;

  const { redis } = context;

  // check if user exists in redis
  const currentScore = await context.redis.zScore(
    redisKey.leaderboard,
    username
  );

  if (!currentScore) {
    // create user entry
    let score = await context.redis.zAdd(redisKey.leaderboard, {
      member: username,
      score: increaseBy,
    });

    console.log(`new user - score added - ${username}`);

    return score;
  }

  // if user exists
  let score = await redis.zIncrBy(redisKey.leaderboard, username, increaseBy);

  return score;
};

export const getUserLeaderboardScore = async (
  context: Devvit.Context | JobContext
) => {
  if (!context.userId) return;

  let u = await context.reddit.getCurrentUser();

  if (!u?.username) return;

  const { redis } = context;

  let score = await redis.zScore(redisKey.leaderboard, u?.username);

  let rank = await redis.zRank(redisKey.leaderboard, u?.username);

  return { score: score, rank: rank };
};

export const delRedis = async (
  context: Devvit.Context | JobContext,
  key: string
) => {
  const { redis } = context;
  await redis.del(key);
  console.log(`redis key del ${key}`);
  return 1;
};

export const getPostTopComment = async (
  context: Devvit.Context | JobContext,
  count: number
) => {
  if (!context.postId) return null;

  const topComment = await context.reddit
    .getComments({
      postId: context.postId,
      limit: 2,
      sort: "top",
    })
    .all();

  let commentReponse: TopWildComment | null = null;

  topComment.forEach((comment) => {
    if (!comment.body.includes(DEV_COMMENT)) {
      commentReponse = {
        username: comment.authorName,
        score: comment.score,
        wildComment: comment.body,
        url: comment.url,
      };
    }
  });

  if (!commentReponse) return null;

  return commentReponse;
};

export const createLeaderboardScheduler = async (
  context: Devvit.Context | JobContext,
  postId: string
) => {
  const fourHoursFromNow = new Date();
  fourHoursFromNow.setHours(fourHoursFromNow.getHours() + 4);

  // for testing
  // fourHoursFromNow.setMinutes(fourHoursFromNow.getMinutes() + 1);

  let data_: any = {};
  data_["postId"] = postId;

  const jobId = await context.scheduler.runJob({
    name: jobKey.POST_COMMENT_SCAN_LEADERBOARD_JOB,
    runAt: fourHoursFromNow,
    data: data_,
  });

  console.log(`current time - ${new Date().toISOString()}`);

  console.log(
    `leaderboard scan job added - ${postId} - at - ${fourHoursFromNow.toISOString()}`
  );
};
