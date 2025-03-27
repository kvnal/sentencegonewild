import { Devvit, JobContext, RichTextBuilder } from "@devvit/public-api";
import { Preview } from "../components/Preview.js";
import { checkSentenceAlreadyCreated, getPostSentence, incPostCountByOne, incrUserLeaderboardScore, savePostedSentenceInfo, saveWildSentencePost } from "../utils/services.js";
import { getRandomSentence } from "../utils/getRandomSentence.js";
import { SentenceEntry } from "../../game/shared.js";
import { gamePointsSystem } from "../utils/keys.js";

export const DEV_COMMENT = "Your username as author on the comment/post created by you would be visible once our app is approved by the reddit team. Thank You!"

const POST_BY_JOB_TITLE = " : Creator's Edition"

export const createWildSentencePost = async (context : Devvit.Context | JobContext, setSentence: string | null = null,  navigateToPost : boolean = false, isPostedByJob : boolean = false, devComment : string = DEV_COMMENT) =>{
    const {reddit} = context;
    let ui = null;
    if(!isPostedByJob && 'ui' in context){
        ui = context.ui;
    }

    const subreddit = await reddit.getCurrentSubreddit();

    const postCount = await incPostCountByOne(context);

    let newPostSentence : SentenceEntry | null = null;

    if(setSentence){
        // user created post
        newPostSentence = {id: 9999 , sentence : setSentence};
    }

    if(!setSentence){
        for (let index = 0; index < 300; index++) {
            // get sentence till it doest posted
            let sentenceTemp = getRandomSentence();
            let isPosted = await checkSentenceAlreadyCreated(context, sentenceTemp.id+"");
            
            if(!sentenceTemp){
                // error reading file
                if(ui){
                    ui.showToast("error getting new sentences!")
                }
                console.log("error getting new sentence!")
                newPostSentence = sentenceTemp;
                break;
            }
            
            if(!isPosted) {
                newPostSentence = sentenceTemp;
                break;
            }
        }
    }
    
    if(!newPostSentence){
        return;
    }
    
    let postTitle = `SGW #${postCount}`;
    
    if(isPostedByJob){
        postTitle = postTitle + POST_BY_JOB_TITLE;
    }

    const post = await reddit.submitPost({
      title: postTitle,
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: <Preview/>,
    });

    await savePostedSentenceInfo(context, newPostSentence, post);

    await saveWildSentencePost(context, post.id);
    

    if(devComment){
        let developerComment = await context.reddit.submitComment({
            id: post.id,
            text: "",
            richtext: new RichTextBuilder().heading({level: 1} ,(h)=>{h.rawText("Developer's note: ")}).paragraph((p)=>{p.text({ text : devComment})})
        })
    }

    if(setSentence && !isPostedByJob){
        // user created post
        await incrUserLeaderboardScore(context, gamePointsSystem.onCreatePost);
    }
    
    if(navigateToPost && ui){
        // navigate only when post is created by user.
            ui.navigateTo(post);
    }

}