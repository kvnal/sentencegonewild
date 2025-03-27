import { Devvit, useState } from '@devvit/public-api';
import { gamePointsSystem, jobKey, redisKey } from '../utils/keys.js';
import { createWildSentencePost, DEV_COMMENT } from '../actions/actions.js';
import { getLeaderboard, incrUserLeaderboardScore } from '../utils/services.js';

// export const AUTO_SENTENCE_POST_JOB = "auto_sentence_post_job"

export const job_leaderboard_scores = Devvit.addSchedulerJob({
    name: jobKey.POST_COMMENT_SCAN_LEADERBOARD_JOB, // you can use an arbitrary name here
    onRun: async (event, context) => {

      const {data} = event;
      if(data?.postId){
        console.log(`leaderboard job - running - ${data?.postId}`);

        let comments = await context.reddit.getComments({
          postId: data.postId + "",
          sort:"top",
          limit : 50
        }).all();

        comments.forEach(async (com)=> {

          if(!com.body.includes(DEV_COMMENT) && com.authorId){

            let updatedScore = await incrUserLeaderboardScore(context, com.score*gamePointsSystem.onEachUpvote, com.authorName);

            console.log(`leaderboard job - score updated for ${com.authorId} - ${com.authorName} - current score - ${updatedScore}`);
            
          }
            
        });
      }
     

      // test
      let scores = await getLeaderboard(context, 5);
      console.log("scores - ", JSON.stringify(scores));

    },
  });

