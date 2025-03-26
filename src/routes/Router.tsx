import { Context, Devvit, useState } from "@devvit/public-api";
import { PostId, PostType } from "../../game/shared.js";
import { getPostType, getUsername } from "../utils/services.js";
import WildSentence from "../components/WildSentence.js";
import PinnedHome from "../components/PinnedHome.js";

const Router: Devvit.CustomPostComponent = (context: Context) => {
    const postId = context.postId as PostId;
    const [data] = useState<{
        postType: PostType;
        username: string | null;
      }>(async () => {
    const [postType, username] = await Promise.all([getPostType(context, postId), getUsername(context)]);
    return {
        postType,
        username
    }});

    const postTypes: Record<string, JSX.Element> = {
        "wildsentence": (
          <WildSentence
            context={context}
          />
        ),
        "pinnedhome": (
            <PinnedHome
                context={context}
            />
        )
    }

    return (
        <zstack width="100%" height="100%" alignment="top start">
        {postTypes[data.postType] || (
          <vstack alignment="center middle" grow>
            <text>Error: Unknown post type</text>
          </vstack>
        )}
      </zstack>
    )
}

export default Router;