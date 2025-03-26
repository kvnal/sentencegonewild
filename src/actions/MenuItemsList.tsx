import { Devvit, MenuItem, RedditAPIClient } from "@devvit/public-api";
import { AUTO_SENTENCE_POST_JOB } from "../scheduler/autoPost.js";
import { Preview } from "../components/Preview.js";
import { savePinnedPost, saveWildSentencePost } from "../utils/services.js";

export const auto_post_turn_on_menuItem: MenuItem = {
  label: "ON - auto post (kunal)",
  location: "subreddit",
  onPress: async (event, context) => {

    const isJobExists = await context.redis.exists(AUTO_SENTENCE_POST_JOB+':jobId');

    if(isJobExists){
      context.ui.showToast("job already exists!");
      return;
    }

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
  label: "OFF - auto post (kunal)",
  location: "subreddit",
  onPress: async (event, context) => {

    const jobId = (await context.redis.get(AUTO_SENTENCE_POST_JOB+':jobId')) || '0';
    await context.scheduler.cancelJob(jobId);
   
    await context.redis.del(AUTO_SENTENCE_POST_JOB+':jobId');
    context.ui.showToast("job cancelled! - " + jobId)
  },
};

export const PinnedPost: MenuItem = {
  label: 'Launch Pinned App (To be Automated)',
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
  label: 'Launch Wild Sentence App',
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
    await saveWildSentencePost(context, post.id);
    ui.navigateTo(post);
  },
}
