import { BlocksToWebviewPayload, CreatePageData, HelpData, LeaderboardData, Page, SentenceData } from './shared';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { AnswerPage } from './pages/AnswerPage';
import { CreatePage } from './pages/CreateWildSentence';
import { HelpPage } from './pages/WildHelp';
import { LeaderboardPage } from './pages/WildLeaderboard';

const getPage = (page: Page, props: BlocksToWebviewPayload) => {
  switch (page) {
    case 'home':
      const {postId, incompleteSentence} = props as SentenceData;
      return <AnswerPage postId={postId} incompleteSentence = {incompleteSentence}/>;
    case 'create_sentence':
        return <CreatePage />;
    case 'help':
      return <HelpPage />;
      case 'leaderboard':
        const {leaderboard} = props as LeaderboardData
        return <LeaderboardPage leaderboard={leaderboard} />;
    
    default:
      throw new Error(`Unknown page: ${page}`);
  }
};

export const App = () => {
  const [data, setData] = useState<BlocksToWebviewPayload>();
  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData?.page === 'home') {
      const received: SentenceData = initData as SentenceData
      setData(received);
    }
    else if (initData?.page === 'create_sentence') {
      const received: CreatePageData = initData as CreatePageData
      setData(received);
    }
    else if (initData?.page === 'help') {
      const received: HelpData = initData as HelpData
      setData(received);
    }   
     else if (initData?.page === 'leaderboard') {
      const received: LeaderboardData = initData as LeaderboardData
      setData(received);
    }
  }, [initData, setData]);

  return initData && data && <div className="h-full">{getPage(initData.page, data )}</div>;
};
