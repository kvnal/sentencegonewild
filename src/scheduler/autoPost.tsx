import { Devvit, useState } from '@devvit/public-api';

export const AUTO_SENTENCE_POST_JOB = "auto_sentence_post_job"

export const job_auto_sentence_post = Devvit.addSchedulerJob({
    name: AUTO_SENTENCE_POST_JOB, // you can use an arbitrary name here
    onRun: async (event, context) => {
      // do stuff when the job is executed
      console.log("run - ",await context.reddit.getCurrentSubredditName(), " - ", new Date())
    },
  });