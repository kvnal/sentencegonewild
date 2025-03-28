import { Devvit, useState, useWebView } from "@devvit/public-api";
import {
  BlocksToWebviewMessage,
  PostId,
  TopWildComment,
  WebviewToBlockMessage,
} from "../../game/shared.js";
import {
  getPostSentence,
  getPostTopComment,
  getUsername,
  incrUserLeaderboardScore,
} from "../utils/services.js";
import {decode} from 'html-entities'
import StyledButton from "../components/Button.js";
import { gamePointsSystem } from "../utils/keys.js";

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

  const [currentUsername] = useState<string>(async () => {
    const currentUsername = await getUsername(context) ?? "";
    return currentUsername; // Try others to test
  });

  const [topWildComment] = useState<TopWildComment | null>(async () => {
    const topWildComment: TopWildComment | null = await getPostTopComment(
      context,
      1
    );

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

          await incrUserLeaderboardScore(context, gamePointsSystem.onComment);

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

  return (
    <vstack
      height="100%"
      width="100%"
      gap="medium"
      alignment="start top"
      padding="large"
      darkBackgroundColor="#000000"
      lightBackgroundColor="#fffbeb"
    >
      <spacer size="medium" />
      <hstack padding="medium" alignment="top start">
        <text size="xxlarge" darkColor="#ffffff" lightColor="#000000" wrap>
          {decode(postSentence.replace(/_/g, "____________").replace(/\//g, "\n"))}
        </text>
      </hstack>

      <spacer size="large" />
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
      <spacer size="small" />
      {topWildComment &&
        topWildComment?.username &&
        topWildComment?.score &&
        topWildComment?.wildComment && (
          <>
            <hstack alignment="top start">
              <text size="small" darkColor="#ffffff" lightColor="#000000">
                Top wild comment:
              </text>
            </hstack>
            <vstack
              padding="small"
              alignment="start middle"
              cornerRadius="medium"
              width="100%"
              darkBackgroundColor="#0B1416"
              lightBackgroundColor="#ffffff"
              border="thin"
              lightBorderColor="#0B1416"
            >
              <hstack alignment="middle start">
                <hstack cornerRadius="full">
                  <image
                    url="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png"
                    description="Logo"
                    height={"20px"}
                    width={"20px"}
                    imageHeight={"240px"}
                    imageWidth={"240px"}
                  />
                </hstack>
                <spacer size="small" />
                <text
                  weight="bold"
                  darkColor="#ffffff"
                  lightColor="#000000"
                  size="small"
                >
                  {topWildComment?.username}
                </text>
              </hstack>
              <hstack alignment="top start">
                <spacer size="large" />
                <hstack alignment="start middle"  grow>
                  <text
                    darkColor="#ffffff"
                    lightColor="#000000"
                    wrap
                    size="medium"
                  >
                    {decode(topWildComment?.wildComment)}
                  </text>
                </hstack>
              </hstack>
              <hstack alignment="middle start">
                <spacer size="large" />
                <icon name="upvotes-fill" size="small" color="#d93900" />
                <spacer size="small" />
                <text weight="bold" darkColor="#ffffff" lightColor="#000000">
                  {topWildComment?.score}
                </text>
              </hstack>
            </vstack>
          </>
        )}


      {/* If new post */}
      {!topWildComment && 
      (
        <>
          <hstack alignment="top start">
            <text size="small" darkColor="#ffffff" lightColor="#000000">
              Top wild comment:
            </text>
          </hstack>
          <vstack
            padding="small"
            alignment="start middle"
            cornerRadius="medium"
            width="100%"
            darkBackgroundColor="#0B1416"
            lightBackgroundColor="#ffffff"
            border="thin"
            lightBorderColor="#0B1416"
          >
            <hstack alignment="middle start">
              <hstack cornerRadius="full">
                <image
                  url="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png"
                  description="Logo"
                  height={"20px"}
                  width={"20px"}
                  imageHeight={"240px"}
                  imageWidth={"240px"}
                />
              </hstack>
              <spacer size="small" />
              <text
                weight="bold"
                darkColor="#ffffff"
                lightColor="#000000"
                size="small"
              >
                {currentUsername}
              </text>
            </hstack>
            <hstack alignment="top start" width="100%">
              <spacer size="large" />
                <text
                  darkColor="#ffffff"
                  lightColor="#000000"
                  size="medium"
                  width="85%"
                  wrap={true}
                >
                 {"Your comment can be here!, be the First one to answer 🔥"}
                </text>
              <spacer size="xsmall" />
            </hstack>
            <hstack alignment="middle start">
              <spacer size="large" />
              <icon name="upvotes-fill" size="small" color="#d93900" />
              <spacer size="small" />
              <text weight="bold" darkColor="#ffffff" lightColor="#000000">
                {999999999}
              </text>
            </hstack>
          </vstack>
        </>
      )}
    </vstack>
  );
};

export default WildSentence;
