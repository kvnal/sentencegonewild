import { Devvit, MenuItem } from "@devvit/public-api";
import { Preview } from "../components/Preview.js";
import { incrUserLeaderboardScore, savePinnedPost } from "../utils/services.js";
import { jobKey } from "../utils/keys.js";
import { createWildSentencePost } from "./actions.js";


const DEV = ""

export const auto_post_turn_on_menuItem: MenuItem = {
  label: "ON - Scheduled Wild Sentence" + DEV,
  location: "subreddit",
  onPress: async (event, context) => {

    const isJobExists = await context.redis.exists(jobKey.AUTO_SENTENCE_POST_JOB+':jobId');

    if(isJobExists){
      context.ui.showToast("job already exists!");
      return;
    }

    const jobId = await context.scheduler.runJob({
        name: jobKey.AUTO_SENTENCE_POST_JOB,
        // cron: "0-59 * * * *", //every minute
        cron: "1 0-23/4 * * *" //every 4 hours
    });

    // save job id for cancelling
    await context.redis.set(jobKey.AUTO_SENTENCE_POST_JOB+':jobId', jobId);
    
    console.log('full job id', await context.redis.get(jobKey.AUTO_SENTENCE_POST_JOB+':jobId'))

    context.ui.showToast('job created - post - ' + jobId);

  },
};


export const auto_post_turn_off_menuItem: MenuItem = {
  label: "OFF - Scheduled Wild Sentence" + DEV,
  location: "subreddit",
  onPress: async (event, context) => {

    const jobId = (await context.redis.get(jobKey.AUTO_SENTENCE_POST_JOB+':jobId')) || '0';
    await context.scheduler.cancelJob(jobId);
   
    await context.redis.del(jobKey.AUTO_SENTENCE_POST_JOB+':jobId');
    context.ui.showToast("job cancelled! - " + jobId)
  },
};

export const PinnedPost: MenuItem = {
  label: 'Post Pinned Home' + DEV,
  // click only for the first time and pin the post (create/leaderboard/help) page.
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Sentence Gone Wild',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: <Preview />,
    });
    await savePinnedPost(context, post.id)
    try{
      await post.sticky();
    }catch (e: any){
      console.log("Failed to Pin the post: ", e.message);
    }
    ui.navigateTo(post);
  },
}

export const WildSentencePost: MenuItem = {
  label: 'Post Wild Sentence' + DEV,
  // to be automated - generate a new wild sentence post
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
      // await incPostCountByOne(context);
      await createWildSentencePost(context, null, true);

  },
}

export const createFakeLeaderboard: MenuItem = {
  label: 'fake leaderboard entry - dev' + DEV,
  // to be automated - generate a new wild sentence post
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
      await incrUserLeaderboardScore(context, 10, "test_user_1")
      await incrUserLeaderboardScore(context, 3, "test_user_2")
      await incrUserLeaderboardScore(context, 12, "test_user_3")
      await incrUserLeaderboardScore(context, 30, "test_user_4")

  },
}
