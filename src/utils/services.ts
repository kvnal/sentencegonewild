import { Devvit, Post } from "@devvit/public-api";
import { IRedisPostData, IRedisUsedSentence, PostHStorage, PostId, PostType, SentenceData, SentenceEntry } from "../../game/shared.js";
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

export const saveWildSentencePost = async(context:Devvit.Context, postId: PostId): Promise<void> => {
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



  export const incPostCountByOne = async (context: Devvit.Context) =>{
    const {redis} = context;
    let totalPostCount = await redis.incrBy(redisKey.totalSentencePostCount,1);
    console.log("post count", totalPostCount)
    return totalPostCount;
  }
  
  

  export const savePostedSentenceInfo = async (context : Devvit.Context, sentence : SentenceEntry, post : Post) =>{
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
  
  export const checkSentenceAlreadyCreated = async (context : Devvit.Context, sentenceId : string) =>{
    const {redis} = context;
    const isUsed = await redis.hGet(redisKey.GameSentence, sentenceId);
    
    if(!isUsed)
      return false;
    
    // exists
    return true;
  }


  
  export const getPostSentence = async (context : Devvit.Context, postId : string) =>{
    const {redis} = context;
    const sentence = await redis.hGet(redisKey.postSentence, postId);
    
    // exists
    return sentence;
  }


