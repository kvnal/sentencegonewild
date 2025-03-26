// import { useSetPage } from '../hooks/usePage';
import { sendToDevvit } from "../utils";
import { SentenceData } from "../shared";
import { DynamicInputs } from "../components/DynmicInputs";
import { useState } from "react";

export const AnswerPage = ({ postId, incompleteSentence }: SentenceData) => {
  // const setPage = useSetPage();
  const [result, setResult] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  return (
    <div className="relative flex h-full w-full flex-col justify-center p-4 rounded-lg dark:bg-black bg-amber-50">
      {check ? (
        <div
          className={
            "relative z-20 mb-4 mt-2 text-left dark:text-white text-black"
          }
        >
          <div className="relative z-20 mb-4 mt-2 w-full text-lg dark:text-white text-black">
            Check your sentence:
          </div>
          <div className="relative z-20 mb-4 mt-2 w-full dark:text-white text-black">
            {result}
          </div>
        </div>
      ) : (
        <div
          className={
            "relative z-20 mb-4 mt-2 text-center w-full dark:text-white text-black"
          }
        >
          <DynamicInputs
            sentence={incompleteSentence}
            onConsolidatedChange={setResult}
            inputValues={inputValues}
            setInputValues={setInputValues}
          />
        </div>
      )}
      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="md:w-1/6 w-1/2 flex items-center justify-center rounded-full bg-sky-900 disabled:bg-gray-100 dark:bg-[#2FFF19] dark:disabled:bg-zinc-800 text-white dark:text-black p-2"
          onClick={() => {
            setCheck(!check);
          }}
        >
          {check ? "Back" : "Check 👀"}
        </button>
      </div>
      <div className="flex justify-center w-full">
        {check && (
          <button
            type="submit"
            className="md:w-1/6 w-1/2 mt-2 flex items-center justify-center rounded-full bg-sky-900 disabled:bg-gray-100 dark:bg-[#2FFF19] dark:disabled:bg-zinc-800 text-white dark:text-black p-2"
            onClick={() => {
              sendToDevvit({
                // Send completed message to Devvit
                type: "SUBMIT",
                payload: {
                  postId: postId,
                  completedSentence: result,
                },
              });
            }}
          >
            Submit ✅
          </button>
        )}
      </div>
      <div className="text-left dark:text-white">
        <div className=" dark:text-white text-black text-lg mb-4">
          Top wild comment:
        </div>
        <div className="flex">
          <div className=" dark:text-white text-black">Username:</div>
          <div className=" dark:text-white text-black ms-2">Dummy Username</div>
        </div>
        <div className="flex">
          <div className=" dark:text-white text-black">Points:</div>
          <div className=" dark:text-white text-black ms-2">00</div>
        </div>
        <div className=" dark:text-white text-black">Completed Sentence:</div>
        <div className=" dark:text-white text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
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
