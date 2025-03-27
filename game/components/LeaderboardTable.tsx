import { LeaderboardScore } from "../shared";

export interface LeaderboardTableProps {
    leaderboard: LeaderboardScore[]
}

const LeaderboardTable = ({leaderboard}: LeaderboardTableProps) => {
  // Sort the data by rank
  const sortedData = [...leaderboard].sort((a, b) => a.rank - b.rank);

  return (
    <div className="overflow-x-auto w-11/12">
          {sortedData.map((entry: LeaderboardScore) => (
            <a className="flex items-center py-4 mx-6 mt-2 border border-lime-300"
            style={{background: entry.isActiveUser ? "#b13ac747" : ""}}
            href={`https://www.reddit.com/user/${entry.username}/`}>
            <span className="text-lime-300 text-md font-medium mx-2">{entry.rank}</span>
            <img className="w-8 h-8 rounded-full object-cover mr-2" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png"
                alt="User avatar" />

            <div className="flex w-full justify-between">
                <h3 className="text-md font-medium text-gray-100">{entry.username}</h3>
                <p className="text-red-400 text-right text-lg mx-2 font-mono font-semibold">{entry.score}</p>
            </div>
        </a>
          ))}
    </div>
  );
};

export default LeaderboardTable;
