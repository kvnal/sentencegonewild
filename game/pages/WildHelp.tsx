import { PostId } from "../shared";

export interface HelpPageProps {
  postId: PostId;
  incompleteSentence: string;
}

export const HelpPage = () => {
  return (
    <div className="relative flex h-full w-full flex-col p-8 dark:bg-black bg-amber-50">
      <div
        className={
          "relative z-20 mb-20 mt-2 text-left w-full text-2xl  dark:text-yellow-300 text-slate-700"
        }
      >
        Help?
      </div>
      <p className="text-5xl mt-10 dark:text-white text-black">Fill the sentence with some funky fillers!</p>
      <p className="text-lg mt-4 dark:text-gray-400 text-black">More the comment upvotes means more points!</p>
      <p className="text-lg mt-4 dark:hidden  text-black">Sorry, assistance is unavailable for those who dare to use light mode 😂.</p>
      
      <p className="text-md mt-20 text-center dark:text-red-400 text-purple-900">Have a wild day !</p>
    </div>
  );
};
