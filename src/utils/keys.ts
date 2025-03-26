import { PostId } from "../../game/shared.js"

export const jobKey = {
    AUTO_SENTENCE_POST_JOB : "auto_sentence_post_job"
}

export const redisKey = {
    totalSentencePostCount : "total_sentence_post_count",
    GameSentence : "game_sentence", //hset used to store sentences used id 
    postSentence: 'post_sentence',
    leaderboard: 'game_leaderboard'
}

export const postKey = {
    postData: (postId: PostId) => `post:${postId}`,
}

export const gamePointsSystem = {
    onCreatePost : 10,
    onComment : 1,
    onEachUpvote : 2,
}