// Learn more at developers.reddit.com/docs
import { Devvit, useForm, useState, useWebView } from '@devvit/public-api';
import './scheduler/autoPost.js'
import { auto_post_turn_off_menuItem, auto_post_turn_on_menuItem } from './actions/menuItems.js';
import { DevvitMessage, WebViewMessage } from './message.js';
import { Preview } from './components/Preview.js';
import { BlocksToWebviewMessage, WebviewToBlockMessage } from '../game/shared.js';

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Install app',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: <Preview />,
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'name of the post',
  height: 'tall',
  render: (_context) => {
    const [counter, setCounter] = useState(0);
    const [Name, setName] = useState<any>("");
    
    const myForm = useForm(
      {
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'I got 99 problems but ',
            helpText: 'asdf asdfasdf '
          },
          {
            type: 'string',
            name: 'temp',
            disabled: true,
            label:"",
            defaultValue:"aint one."
          },
        ],
      },
      (values) => {
        // onSubmit handler
        setName(values.name);
      }
    );
   
    
    const {mount} = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>({
      // URL of your web view content
      onMessage: async (event, {postMessage}) => {

        console.log("Recieved message from webview", event);

        const data = event as unknown as WebviewToBlockMessage;

        if (data.type === 'INIT') {
          //  send question to webview

          postMessage({type: "INIT_RESPONSE",
            payload: {postId: _context.postId!,  incompleteSentence: "This is an incomplete Sentence to display from Devvit backend"}}); // Random Sentece will be entered here
          }

        if(data.type == "SUBMIT"){
            // do the redis? and create a comment
            // changeview to check submitted page
            console.log("User completed sentence",data.payload.completedSentence);

        }

      },
      onUnmount() {
        // _context.ui.showToast('Web view closed!');
        console.log("Webview closed!")
      },
    });

    
    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        {/* <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <button appearance="primary" onPress={() => setCounter((counter) => counter + 1)}>
          Click me! ok
        </button> */}

        <button appearance="primary" onPress={() => _context.ui.showForm(myForm)}>
         Form
        </button>
        <button appearance="primary" onPress={() =>mount()}>
         Launch
        </button>
      </vstack>
    );
  },
});




Devvit.addMenuItem(auto_post_turn_on_menuItem);
Devvit.addMenuItem(auto_post_turn_off_menuItem);
export default Devvit;
