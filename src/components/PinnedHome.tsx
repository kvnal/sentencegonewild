import { Devvit, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  WebviewToBlockMessage,
} from "../../game/shared.js";
import { getRandomSentence } from "../utils/getRandomSentence.js";
import StyledButton from "./Button.js";

export interface WildSentenceProps {
  context: Devvit.Context;
}
const PinnedHome = (props: WildSentenceProps): JSX.Element => {
  const { context } = props;
  const { mount } = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>({
    // URL of your web view content
    onMessage: async (event, { postMessage }) => {
      const todaySentence = getRandomSentence();
      console.log("Recieved message from webview", event);

      const data = event as unknown as WebviewToBlockMessage;

      if (data.type === "INIT") {
        //  send question to webview

        postMessage({
          type: "INIT_RESPONSE",
          payload: {
            postId: context.postId!,
            incompleteSentence: todaySentence.sentence,
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
      <text size="large">{"Pinned Home (Image Will Replace)"}</text>
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
        text="Create Sentence"
        onPress={() => mount()}
      />
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
        text="Leaderboard"
        onPress={() => mount()}
      />
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
        text="Help"
        onPress={() => mount()}
      />
    </vstack>
  );
};

export default PinnedHome;
