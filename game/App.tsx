import { Page, SentenceData } from './shared';
import { HomePage } from './pages/HomePage';
import { usePage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { AnswerPage } from './pages/AnswerPage';

const getPage = (page: Page, { postId, incompleteSentence }: SentenceData) => {
  switch (page) {
    case 'test':
      return <HomePage postId={postId} incompleteSentence = {incompleteSentence}/>;
    case 'home':
      return <AnswerPage postId={postId} incompleteSentence = {incompleteSentence}/>;
    default:
      throw new Error(`Unknown page: ${page}`);
  }
};

export const App = () => {
  const [data, setData] = useState<SentenceData>({postId: "", incompleteSentence: ""});
  const page = usePage();
  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      setData({postId: initData.postId, incompleteSentence: initData.incompleteSentence});
    }
  }, [initData, setData]);

  return <div className="h-full">{getPage(page, data )}</div>;
};
