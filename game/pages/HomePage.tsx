// import { useSetPage } from '../hooks/usePage';
import { sendToDevvit } from '../utils';
import { SentenceData } from '../shared';

export const HomePage = ({ postId, incompleteSentence }: SentenceData) => {
  // const setPage = useSetPage();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
      <p className="relative z-20 mb-4 mt-2 text-center text-neutral-300">Sentence: {incompleteSentence}</p>

      <button
        type="submit"
        className="flex items-center justify-center rounded bg-black disabled:bg-gray-100 dark:bg-zinc-900 dark:disabled:bg-zinc-800 dark:text-white p-2"
        onClick={()=>{
          sendToDevvit({ // Send completed message to Devvit
            type: 'SUBMIT',
            payload: { postId: postId, completedSentence: incompleteSentence }
          });
        }}
      >
        Check (Send to Devvit for now...) ✅
      </button>
    </div>
  );
};

// const MagicButton = ({ children, ...props }: ComponentProps<'button'>) => {
//   return (
//     <button
//       className={cn(
//         'relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
//         props.className
//       )}
//       {...props}
//     >
//       <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
//       <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//         {children}
//       </span>
//     </button>
//   );
// };
