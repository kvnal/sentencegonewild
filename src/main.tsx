// Learn more at developers.reddit.com/docs
import { Devvit, useForm, useState, useWebView } from '@devvit/public-api';
import './scheduler/autoPost.js'
import { auto_post_turn_off_menuItem, auto_post_turn_on_menuItem } from './actions/menuItems.js';
import { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
  redditAPI: true,
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
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
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
   
    
    const webView = useWebView<WebViewMessage, DevvitMessage>({
      // URL of your web view content
      url: 'page.html',
      onMessage(message, _webView){
        console.log("recieved from webview", message);
        if (message.type === 'webViewReady') {
          //  send question to webview

          _webView.postMessage({type: "newQuestion",
            incompleteSentence: "this is sentece to display from devvit"}) ;
          }


          // _context.redis.zScore()
        if(message.type == "submit"){
            // do the redis? and create a comment
            // changeview to check submitted page
            console.log("user completed sentence",message.userSentence);
            console.log("postid",_context.postId)

            if(_context.postId){
              _context.reddit.submitComment({text:"auto text", id: _context.postId})
            }
        }

      },
      onUnmount() {
        // _context.ui.showToast('Web view closed!');
        console.log("webview closed!")
      },
    });

    
    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <text size="large">{`Click counter: ${counter}`}</text>
        <button appearance="primary" onPress={() => setCounter((counter) => counter + 1)}>
          Click me! ok
        </button>

        <button appearance="primary" onPress={() => _context.ui.showForm(myForm)}>
         form
        </button>
        <button appearance="primary" onPress={() =>webView.mount()}>
         webview
        </button>
      </vstack>
    );
  },
});




Devvit.addMenuItem(auto_post_turn_on_menuItem);
Devvit.addMenuItem(auto_post_turn_off_menuItem);
export default Devvit;
