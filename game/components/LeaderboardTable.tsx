import { LeaderboardScore } from "../shared";

export interface LeaderboardTableProps {
    leaderboard: LeaderboardScore[]
}

const LeaderboardTable = ({leaderboard}: LeaderboardTableProps) => {
  // Sort the data by rank
  const sortedData = [...leaderboard].sort((a, b) => a.rank - b.rank);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border rounded-lg">
        <thead className="bg-stone-200 dark:bg-gray-800 rounded-t-lg">
          <tr className="rounded-t-lg">
            <th className="border px-4 py-2 text-left text-black dark:text-white border-black dark:border-lime-300 rounded-tl-lg">
              Rank
            </th>
            <th className="border px-4 py-2 text-left text-black dark:text-white border-black dark:border-lime-300">
              Username
            </th>
            <th className="border px-4 py-2 text-left text-black dark:text-white border-black dark:border-lime-300 rounded-tr-lg">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry: LeaderboardScore) => (
            <tr
              key={entry.rank}
              className="odd:bg-slate-100 even:bg-stone-200 dark:odd:bg-gray-700 dark:even:bg-gray-800 last:rounded-b-lg"
            >
              <td className="border px-4 py-2 text-black dark:text-white border-black dark:border-lime-300">
                {entry.rank}
              </td>
              <td className="border px-4 py-2 text-black dark:text-white border-black dark:border-lime-300">
                {entry.username}
              </td>
              <td className="border px-4 py-2 text-black dark:text-white border-black dark:border-lime-300">
                {entry.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
