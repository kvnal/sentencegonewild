// Learn more at developers.reddit.com/docs
import { Devvit } from '@devvit/public-api';
import './scheduler/autoPost.js'
import "./scheduler/leaderBoardUpdate.js"
import { auto_post_turn_off_menuItem, auto_post_turn_on_menuItem, createFakeLeaderboard, PinnedPost, WildSentencePost} from './actions/MenuItemsList.js';

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
// Devvit.addMenuItem(createFakeLeaderboard);

// Add a post type definition
Devvit.addCustomPostType({ 
  name: 'Sentence Gone Wild', 
  height: 'tall',
  render: Router
});

export default Devvit;
