import { MenuItem } from "@devvit/public-api";
import { AUTO_SENTENCE_POST_JOB } from "../scheduler/autoPost.js";

export const auto_post_turn_on_menuItem: MenuItem = {
  label: "ON - auto post",
  location: "subreddit",
  onPress: async (event, context) => {

    const jobId = await context.scheduler.runJob({
        name: AUTO_SENTENCE_POST_JOB,
        cron: "0-59 * * * *" //every minute
    });

    // save job id for cancelling
    await context.redis.set(AUTO_SENTENCE_POST_JOB+':jobId', jobId);
    
    console.log('full job id', await context.redis.get(AUTO_SENTENCE_POST_JOB+':jobId'))

    context.ui.showToast('job created - post - ' + jobId);

  },
};


export const auto_post_turn_off_menuItem: MenuItem = {
  label: "OFF - auto post",
  location: "subreddit",
  onPress: async (event, context) => {

    const jobId = (await context.redis.get(AUTO_SENTENCE_POST_JOB+':jobId')) || '0';
    await context.scheduler.cancelJob(jobId);
   
    context.ui.showToast("job cancelled! - " + jobId)
  },
};
