import { Devvit, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  LeaderboardScore,
  PostId,
  WebviewToBlockMessage,
} from "../../game/shared.js";
import StyledButton from "../components/Button.js";
import { getLeaderboard, getUserLeaderboardScore } from "../utils/services.js";

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
        const leaderboardData: LeaderboardScore[] = [];
        
        const leaderboardApi = await getLeaderboard(context,5);
        
        let currentUsername = await context.reddit.getCurrentUsername();
        let currentUsernameInTop5 : boolean = false;
        
        const currentUserLeaderboard = await getUserLeaderboardScore(context);

        leaderboardApi.forEach((element,index) => {
          leaderboardData.push({
              username : element.member,
              score : element.score,
              rank : index+1,
              isActiveUser : element.member == currentUsername 
          })
          if(element.member == currentUsername){
            currentUsernameInTop5 = true;
          }

        });

        if(!currentUsernameInTop5 && currentUserLeaderboard?.rank && currentUserLeaderboard?.score){
        
          leaderboardData.push({
            rank: currentUserLeaderboard.rank + 1 | -1,
            score : currentUserLeaderboard.score,
            username: currentUsername ? currentUsername : "You"
          })
        }

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
        height={"130px"}
        width={"195px"}
        imageHeight={"240px"}
        imageWidth={"360px"}
      />
      <spacer size="small" />
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
          darkBackgroundColor: "#bbf4500",
          lightBackgroundColor: "#024a7000",
          lightBorderColor: "#024a70",
          lightTextColor: "#024a70",
          darkTextColor: "#bbf451",
        }}
        text="Leaderboard"
        onPress={() => leaderboard.mount()}
      />
      <StyledButton
        width="30%"
        height="auto"
        style={{
          darkBorderColor: "#bbf451",
          darkBackgroundColor: "#bbf4500",
          lightBackgroundColor: "#024a7000",
          lightBorderColor: "#024a70",
          lightTextColor: "#024a70",
          darkTextColor: "#bbf451",
        }}
        text="Help"
        onPress={() => help.mount()}
      />
    </vstack>
  );
};

export default PinnedHome;
