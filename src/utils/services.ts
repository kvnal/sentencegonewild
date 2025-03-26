import { Devvit } from "@devvit/public-api";
import { PostHStorage, PostId, PostType } from "../../game/shared.js";

const keys = {
    postData: (postId: PostId) => `post:${postId}`,
}

export const getPostType = async(context:Devvit.Context, postId: PostId) => {
    const key = keys.postData(postId);
    const postType = await context.redis.hGet(key, 'postType') as PostType;
    const defaultPostType: PostType = PostType.WILDSENTENCE;
    return (postType ?? defaultPostType) as PostType;
}

export const savePinnedPost = async(context:Devvit.Context, postId: PostId): Promise<void> => {
    const key = keys.postData(postId);
    const storedType: PostHStorage = {
        postId,
        postType: PostType.PINNED,
      }
    await context.redis.hSet(key, storedType as unknown as Record<string, string>);
}

export const saveWildSentencePost = async(context:Devvit.Context, postId: PostId): Promise<void> => {
    const key = keys.postData(postId);
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