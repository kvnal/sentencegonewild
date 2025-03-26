import { Devvit } from "@devvit/public-api";
import { Preview } from "../components/Preview.js";
import { checkSentenceAlreadyCreated, getPostSentence, incPostCountByOne, savePostedSentenceInfo, saveWildSentencePost } from "../utils/services.js";
import { getRandomSentence } from "../utils/getRandomSentence.js";
import { SentenceEntry } from "../../game/shared.js";

export const createWildSentencePost = async (context : Devvit.Context, navigateToPost = false) =>{
    const { reddit, ui } = context;


    const subreddit = await reddit.getCurrentSubreddit();

    const postCount = await incPostCountByOne(context);

    let newPostSentence : SentenceEntry | null = null;

    for (let index = 0; index < 300; index++) {
        // get sentence till it doest posted
        let sentenceTemp = getRandomSentence();
        let isPosted = await checkSentenceAlreadyCreated(context, sentenceTemp.id+"");

        if(!sentenceTemp){
            // error reading file
            context.ui.showToast("error getting new sentences!")
            newPostSentence = sentenceTemp;
            break;
        }

        if(!isPosted) {
            newPostSentence = sentenceTemp;
            break;
        }
    }
    
    if(!newPostSentence){
        return;
    }
    

    const post = await reddit.submitPost({
      title: `SGW #${postCount}`,
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: <Preview/>,
    });

    await savePostedSentenceInfo(context, newPostSentence, post);

    await saveWildSentencePost(context, post.id);
    
    if(navigateToPost){
        // navigate only when post is created by user.
        ui.navigateTo(post);
        post.id
    }
}