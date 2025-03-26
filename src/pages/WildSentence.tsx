import { Devvit, useState, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  PostId,
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

  const { mount } = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>({
    // URL of your web view content
    onMessage: async (event, { postMessage }) => {
      console.log("Recieved message from webview", event);

      const data = event as unknown as WebviewToBlockMessage;

      if (data.type === "INIT") {
        //  send question to webview

        postMessage({
          type: "INIT_RESPONSE",
          payload: {
            postId: context.postId!,
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
      console.log("Webview closed!");
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
      alignment="center middle"
      darkBackgroundColor="#000000"
      lightBackgroundColor="#fffbeb"
    >
      <text size="xlarge" darkColor="#ffffff" lightColor="#000000">
        {postSentence.replace("_", "____________").replace("/", "\n")}
      </text>
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
        onPress={() => mount()}
      />
    </vstack>
  );
};

export default WildSentence;
