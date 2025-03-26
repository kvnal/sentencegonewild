import { Devvit, useState, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  PostId,
  TopWildComment,
  WebviewToBlockMessage,
} from "../../game/shared.js";
import { getPostSentence } from "../utils/services.js";
import StyledButton from "../components/Button.js";

export interface WildSentenceProps {
  context: Devvit.Context;
  postId: PostId;
}
const WildSentence = (props: WildSentenceProps): JSX.Element => {
  const { context, postId } = props;

  //   //todo getPostSentence(context,postId)

  const [postSentence] = useState<string>(async () => {
    const postSentence = (await getPostSentence(context, postId)) ?? "";
    return postSentence; // Try others to test
  });

  const [topWildComment] = useState<TopWildComment>(async () => {
    const topWildComment: TopWildComment = {
      // Dummy, replace with API call
      username: "r/DevvitDummy",
      score: 21,
      wildComment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    };
    return topWildComment; // Try others to test
  });

  const wildSentence = useWebView<
    WebviewToBlockMessage,
    BlocksToWebviewMessage
  >({
    // URL of your web view content
    onMessage: async (event, { postMessage }) => {
      console.log("Recieved message from webview", event);

      const data = event as unknown as WebviewToBlockMessage;

      if (data.type === "INIT") {
        //  send question to webview

        postMessage({
          type: "INIT_RESPONSE",
          payload: {
            page: "home",
            postId: context.postId as PostId,
            incompleteSentence: postSentence,
          },
        }); // Random Sentece will be entered here
      }

      if (data.type == "SUBMIT") {
        // do the redis? and create a comment
        // changeview to check submitted page
        console.log("User completed sentence", data.payload.completedSentence);
        console.log("postid", context.postId);

        if (context.postId) {
          let comment = await context.reddit.submitComment({
            text: data.payload.completedSentence,
            id: context.postId,
          });

          // submit page - check out some wild sentece button - on click - code
          context.ui.navigateTo(comment);
        }
      }
    },
    onUnmount() {
      // _context.ui.showToast('Web view closed!');
      console.log("Wild Sentence Answer Page closed!");
    },
  });

  // Upvote
  // uname
  // Completed sentence\

  /*
    Home Page Post
    Photo
    // Create
    - Webview input + submit button
    // Help option 
    - Help webview
    // Leaderboard
    - Data
    // Username + Score list of 5 + 1 (Overall) + Rank

    */

  /* Block 
     Incomplete Sentence
     Top Comment
     Answer button
     - Sentence
     - Input box bottom border only
     - Dynamic input 
     - Check (Optional)
     - Check screen (Optional)
     - Submit   
    */

  return (
    <vstack
      height="100%"
      width="100%"
      gap="medium"
      alignment="start middle"
      padding="medium"
      darkBackgroundColor="#000000"
      lightBackgroundColor="#fffbeb"
    >
      <text size="xlarge" darkColor="#ffffff" lightColor="#000000" wrap>
        {postSentence.replace(/_/g, "____________").replace("/", "\n")}
      </text>
      <spacer size="small" />
      <hstack
        width="100%"
        gap="medium"
        alignment="center middle"
        darkBackgroundColor="#000000"
        lightBackgroundColor="#fffbeb"
      >
        <StyledButton
          width="30%"
          height="auto"
          style={{
            darkBorderColor: "#bbf451",
            darkBackgroundColor: "#bbf451",
            lightBackgroundColor: "#024a70",
            lightBorderColor: "#024a70",
            lightTextColor: "#ffffff",
            darkTextColor: "#000000",
          }}
          text="Answer!"
          onPress={() => wildSentence.mount()}
        />
      </hstack>
      {topWildComment?.username &&
        topWildComment?.score &&
        topWildComment?.wildComment && (
          <>
            <spacer size="large" />
            <text size="large" darkColor="#ffffff" lightColor="#000000">Top wild comment:</text>
            <hstack>
              <text darkColor="#ffffff" lightColor="#000000">Username:</text>
              <spacer size="small" />
              <text weight="bold" darkColor="#ffffff" lightColor="#000000">{topWildComment.username}</text>
            </hstack>
            <hstack>
              <text darkColor="#ffffff" lightColor="#000000">Score:</text>
              <spacer size="small" />
              <text weight="bold" darkColor="#ffffff" lightColor="#000000">{topWildComment.score}</text>
            </hstack>
            <vstack>
              <text darkColor="#ffffff" lightColor="#000000">Completed Sentence:</text>
              <spacer size="small" />
              <text darkColor="#ffffff" lightColor="#000000" wrap>{topWildComment.wildComment}</text>
            </vstack>
          </>
        )}
    </vstack>
  );
};

export default WildSentence;
