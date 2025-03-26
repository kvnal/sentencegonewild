import { Devvit, JobContext, Post } from "@devvit/public-api";
import { IRedisPostData, IRedisUsedSentence, PostHStorage, PostId, PostType, SentenceEntry } from "../../game/shared.js";
import { redisKey, postKey } from "./keys.js";

export const getPostType = async(context:Devvit.Context, postId: PostId) => {
    const key = postKey.postData(postId);
    const postType = await context.redis.hGet(key, 'postType') as PostType;
    const defaultPostType: PostType = PostType.WILDSENTENCE;
    return (postType ?? defaultPostType) as PostType;
}

export const savePinnedPost = async(context:Devvit.Context, postId: PostId): Promise<void> => {
    const key = postKey.postData(postId);
    const storedType: PostHStorage = {
        postId,
        postType: PostType.PINNED,
      }
    await context.redis.hSet(key, storedType as unknown as Record<string, string>);
}

export const saveWildSentencePost = async(context:Devvit.Context | JobContext, postId: PostId): Promise<void> => {
    const key = postKey.postData(postId);
    const storedType: PostHStorage = {
        postId,
        postType: PostType.WILDSENTENCE,
      }
    await context.redis.hSet(key, storedType as unknown as Record<string, string>);
}

export const getUsername = async (context: Devvit.Context) => {
    if (!context.userId) return null; // Return early if no userId
    const cacheKey = 'cache:userId-username';
    const cache = await context.redis.hGet(cacheKey, context.userId);
    if (cache) {
      return cache;
    } else {
      const user = await context.reddit.getUserById(context.userId);
      if (user) {
        await context.redis.hSet(cacheKey, {
          [context.userId]: user.username,
        });
        return user.username;
      }
    }
    return null;
  };



  export const incPostCountByOne = async (context: Devvit.Context | JobContext) =>{
    const {redis} = context;
    let totalPostCount = await redis.incrBy(redisKey.totalSentencePostCount,1);
    console.log("post count", totalPostCount)
    return totalPostCount;
  }
  
  

  export const savePostedSentenceInfo = async (context : Devvit.Context | JobContext, sentence : SentenceEntry, post : Post) =>{
    const {redis} = context;

    // save the used sentence id
    let data : IRedisUsedSentence = {};
    data[sentence.id] = 'true';

    await redis.hSet(redisKey.GameSentence, data);
    

    // save the created post: postid -> sentence
    let postData : IRedisPostData = {};
    postData[post.id] = sentence.sentence;

    await redis.hSet(redisKey.postSentence, postData);

    return 1;
  }
  
  export const checkSentenceAlreadyCreated = async (context : Devvit.Context | JobContext, sentenceId : string) =>{
    const {redis} = context;
    const isUsed = await redis.hGet(redisKey.GameSentence, sentenceId);
    
    if(!isUsed)
      return false;
    
    // exists
    return true;
  }


  
  export const getPostSentence = async (context : Devvit.Context | JobContext, postId : string) =>{
    const {redis} = context;
    const sentence = await redis.hGet(redisKey.postSentence, postId);
    
    // exists
    return sentence;
  }


  export const getLeaderboard = async (context : Devvit.Context | JobContext, tillCount: number)=>{

    const {redis} = context;

    let scores = await redis.zRange(redisKey.leaderboard,0,tillCount, {
      by: 'rank',
      reverse: true
    });

    return scores;
  }
  
  export const incrUserLeaderboardScore = async (context : Devvit.Context | JobContext, increaseBy: number)=>{

    if(!context.userId) return;

    const {redis} = context;

    let score = await redis.zIncrBy(redisKey.leaderboard, context.userId, increaseBy);

    return score;
  }
  
  export const getUserLeaderboardScore = async (context : Devvit.Context | JobContext)=>{

    if(!context.userId) return;

    const {redis} = context;

    let score = await redis.zScore(redisKey.leaderboard, context.userId);

    return score;
  }
  
  export const setUserLeaderboardScore = async (context : Devvit.Context | JobContext, setScore : number)=>{

    if(!context.userId) return;

    const {redis} = context;

    let score = await redis.zAdd(redisKey.leaderboard, {member:context.userId, score : setScore});

    return score;
  }


  