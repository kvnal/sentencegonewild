import { Devvit, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  LeaderboardScore,
  PostId,
  WebviewToBlockMessage,
} from "../../game/shared.js";
import StyledButton from "../components/Button.js";

export interface PinnedHomeProps {
  context: Devvit.Context;
}
const PinnedHome = (props: PinnedHomeProps): JSX.Element => {
  const { context } = props; // For username if needed.

  const createSentence = useWebView<
    WebviewToBlockMessage,
    BlocksToWebviewMessage
  >({
    onMessage: async (event, { postMessage }) => {
      const data = event as unknown as WebviewToBlockMessage;

      if (data.type === "INIT") {
        postMessage({
          type: "INIT_RESPONSE",
          payload: {
            page: "create_sentence",
          },
        });
      }

      if (data.type == "SUBMIT_SENTENCE") {
        // do the redis? and create a comment
        // changeview to check submitted page
        console.log("User entered new sentence", data.payload.newSentence);

        // To-do: create new post.
        //   let comment = await context.reddit.submitComment({
        //     text: data.payload.new,
        //     id: context.postId,
        //  )}
        //   // submit page - check out some wild sentece button - on click - code
        //   context.ui.navigateTo(comment);
        //
      }
    },
    onUnmount() {
      // _context.ui.showToast('Web view closed!');
      console.log("Create Sentence closed!");
    },
  });
  const help = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>({
    onMessage: async (event, { postMessage }) => {
      const data = event as unknown as WebviewToBlockMessage;

      if (data.type === "INIT") {
        postMessage({
          type: "INIT_RESPONSE",
          payload: {
            page: "help",
          },
        });
      }
    },
    onUnmount() {
      console.log("Help closed!");
    },
  });
  const leaderboard = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>(
    {
      onMessage: async (event, { postMessage }) => {
        const leaderboardData: LeaderboardScore[] = [
          // Dummy Data
          { username: "r/dummy", score: 2302, rank: 2 },
          { username: "r/dummyla", score: 2151, rank: 3 },
          { username: "r/newdummy", score: 3467, rank: 1 },
          { username: "r/verydummy", score: 1172, rank: 5 },
          { username: "r/maakidummy", score: 1398, rank: 4 },
          { username: "r/noobdummy", score: 21, rank: 23 },
        ];

        const data = event as unknown as WebviewToBlockMessage;

        if (data.type === "INIT") {
          postMessage({
            type: "INIT_RESPONSE",
            payload: {
              page: "leaderboard",
              leaderboard: leaderboardData,
            },
          });
        }
      },
      onUnmount() {
        console.log("Leaderboard closed!");
      },
    }
  );

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
      <image
          url="sgw-logo-card-large.png"
          description="Logo"
          height={'200px'}
          width={'300px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
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
        text="Create Sentence"
        onPress={() => createSentence.mount()}
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
        onPress={() => leaderboard.mount()}
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
        onPress={() => help.mount()}
      />
    </vstack>
  );
};

export default PinnedHome;
