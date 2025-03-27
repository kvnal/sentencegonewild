import { PostId } from "../shared";

export interface HelpPageProps {
  postId: PostId;
  incompleteSentence: string;
}

export const HelpPage = () => {
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-4 rounded-lg dark:bg-black bg-amber-50">
      <div
        className={
          "relative z-20 mb-10 mt-2 text-left w-full text-2xl  dark:text-amber-200 text-slate-700"
        }
      >
        Help?
      </div>
      <p className="text-2xl mt-10 dark:text-white text-black">Fill the sentence with some funky fillers!</p>
      <p className="text-3xl mt-4 dark:text-white text-black">More the comment upvotes means more points!</p>
      <p className="text-3xl mt-4 dark:text-white text-black">Sorry, assistance is unavailable for those who dare to use light mode 😂.</p>
      
      <p className="text-md mt-10 text-center dark:text-orange-700 text-purple-900">Have a wild day !</p>
    </div>
  );
};
