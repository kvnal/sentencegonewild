// Learn more at developers.reddit.com/docs
import { Devvit } from '@devvit/public-api';
import './scheduler/autoPost.js'
import { auto_post_turn_off_menuItem, auto_post_turn_on_menuItem, PinnedPost, WildSentencePost} from './actions/MenuItemsList.js';

import Router from './routes/Router.js';

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem(PinnedPost);
Devvit.addMenuItem(WildSentencePost);
Devvit.addMenuItem(auto_post_turn_on_menuItem);
Devvit.addMenuItem(auto_post_turn_off_menuItem);

// Add a post type definition
Devvit.addCustomPostType({ 
  name: 'Sentence Gone Wild', 
  height: 'tall',
  render: Router
});
  // (_context) => {
  //   const {mount} = useWebView<WebviewToBlockMessage, BlocksToWebviewMessage>({
  //     // URL of your web view content
  //     onMessage: async (event, {postMessage}) => {
  //       const todaySentence = getRandomSentence();
  //       console.log("Recieved message from webview", event);

  //       const data = event as unknown as WebviewToBlockMessage;

  //       if (data.type === 'INIT') {
  //         //  send question to webview

  //         postMessage({type: "INIT_RESPONSE",
  //           payload: {postId: _context.postId!,  incompleteSentence: todaySentence.sentence}}); // Random Sentece will be entered here
  //         }

  //       if(data.type == "SUBMIT"){
  //           // do the redis? and create a comment
  //           // changeview to check submitted page
  //           console.log("User completed sentence",data.payload.completedSentence);
  //           console.log("postid",_context.postId)

  //           if(_context.postId){
  //             let comment = await _context.reddit.submitComment({text: data.payload.completedSentence, id: _context.postId})

  //             // submit page - check out some wild sentece button - on click - code  
  //             _context.ui.navigateTo(comment);
  //           }

  //       }

  //     },
  //     onUnmount() {
  //       // _context.ui.showToast('Web view closed!');
  //       console.log("Webview closed!")
  //     },
  //   });

  //   // Upvote
  //   // uname
  //   // Completed sentence\

  //   /*
  //   Home Page Post
  //   Photo
  //   // Create
  //   - Webview input + submit button
  //   // Help option 
  //   - Help webview
  //   // Leaderboard
  //   - Data
  //   // Username + Score list of 5 + 1 (Overall) + Rank

  //   */

  //   /* Block 
  //    Incomplete Sentence
  //    Top Comment
  //    Answer button
  //    - Sentence
  //    - Input box bottom border only
  //    - Dynamic input 
  //    - Check (Optional)
  //    - Check screen (Optional)
  //    - Submit   
  //   */
    
  //   return (
  //     <vstack height="100%" width="100%" gap="medium" alignment="center middle">
  //       {/* <text size="large">{`Click counter: ${counter}`}</text>
  //       <text size="large">{`Click counter: ${counter}`}</text>
  //       <text size="large">{`Click counter: ${counter}`}</text>
  //       <text size="large">{`Click counter: ${counter}`}</text>
  //       <button appearance="primary" onPress={() => setCounter((counter) => counter + 1)}>
  //         Click me! ok
  //       </button> */}

  //       {/* <button appearance="primary" onPress={() => _context.ui.showForm(myForm)}>
  //        Form
  //       </button> */}
  //       <button appearance="primary" onPress={() =>mount()}>
  //        Launch
  //       </button>
  //     </vstack>
  //   );
  // },
export default Devvit;
