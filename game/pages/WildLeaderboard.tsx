import { LeaderboardScore } from "../shared";

export interface LeaderboardPageProps {
  leaderboard: LeaderboardScore[];
}

export const LeaderboardPage = ({ leaderboard }: LeaderboardPageProps) => {
  console.log(leaderboard);

  return (
    <div className="relative flex h-full w-full flex-col justify-center p-4 rounded-lg dark:bg-black bg-amber-50">
      <div
        className={
          "relative z-20 mb-4 mt-2 text-left w-full dark:text-white text-black"
        }
      >
        Leaderboard
      </div>
      <div className="w-full"><pre className="text-white text-xs">{JSON.stringify(leaderboard, null, 2)}</pre></div>
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
