import { sendToDevvit } from "../utils";
import { PostId } from "../shared";
import { DynamicInputs } from "../components/DynamicInputs";
import { useEffect, useState } from "react";

export interface AnswerPageProps {
  postId: PostId;
  incompleteSentence: string;
}

export const AnswerPage = ({ postId, incompleteSentence }: AnswerPageProps) => {
  // const setPage = useSetPage();
  const [result, setResult] = useState<string | undefined>("");
  const [error, setError] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const resultIntermediate = getConsolidatedSentence(inputValues);
    if (resultIntermediate != "") {
      setError(false);
    }
  }, [inputValues]);

  // Function to get the consolidated sentence with validation
  const getConsolidatedSentence = (newValues: {
    [key: string]: string;
  }): string => {
    const lines = incompleteSentence.split("/").map((line) => line.trim());
    let result = "";
    const newErrors: { [key: string]: boolean } = {};

    lines.forEach((line, lineIndex) => {
      const parts = line.split("_");
      let lineResult = "";

      parts.forEach((part, partIndex) => {
        lineResult += part;

        if (partIndex < parts.length - 1) {
          const value = newValues[`${lineIndex}-${partIndex}`]?.trim() || "";
          if (value === "") {
            newErrors[`${lineIndex}-${partIndex}`] = true; // Mark input as invalid
          } else {
            newErrors[`${lineIndex}-${partIndex}`] = false; // Clear previous error
          }
          lineResult += value;
        }
      });

      // Add input at end if no underscores and it's the last line
      if (parts.length === 1 && lineIndex === lines.length - 1) {
        const value = newValues[`end-${lineIndex}`]?.trim() || "";
        if (value === "") {
          newErrors[`end-${lineIndex}`] = true; // Mark input as invalid
        } else {
          newErrors[`end-${lineIndex}`] = false; // Clear previous error
        }
        lineResult += value;
      }

      result += lineResult;
      if (lineIndex < lines.length - 1) {
        result += " / ";
      }
    });

    // Prevent consolidation if there are errors
    if (Object.values(newErrors).some((hasError) => hasError)) {
      return "";
    }

    return result;
  };

  return (
    <div className="relative flex h-full w-full flex-col p-8 dark:bg-black bg-amber-50">
      {check ? (
        <div
          className={
            "relative z-20 mb-4 mt-2 text-left dark:text-white text-black"
          }
        >
          <div className="relative z-20 mb-6 mt-2 w-full text-md dark:text-lime-300 text-black">
            Check your sentence:
          </div>
          <div className="relative z-20 mb-6 mt-2 w-full text-3xl text-wrap dark:text-white text-black">
            {result}
          </div>
        </div>
      ) : (
        <div
          className={
            "relative z-20 mb-4 mt-2 text-center w-full dark:text-white text-black"
          }
          style={{width:'70%'}}
        >
          <DynamicInputs
            sentence={incompleteSentence}
            inputValues={inputValues}
            setInputValues={setInputValues}
          />
        </div>
      )}
      <div className="flex justify-center w-full h-full items-center">
        {!check && (
          <button
            type="submit"
            className={`md:w-1/6 w-1/4 flex h-10 items-center justify-center rounded-full  p-2 font-bold ${
              error
                ? "bg-red-500 text-black"
                : "bg-sky-900 dark:bg-lime-300  text-white dark:text-black"
            }`}
            onClick={() => {
              const resultIntermediate = getConsolidatedSentence(inputValues);
              if (resultIntermediate !== "") {
                setResult(resultIntermediate);
                setCheck(!check);
              } else setError(true);
            }}
          >
            Check
          </button>
        )}

{check && result && result != "" && (
        <>
        <div className="flex justify-center w-full mt-2">
            <button
              type="submit"
              className="md:w-1/6 w-1/2 flex items-center justify-center rounded-full border-2 border-sky-900  dark:border-lime-300 bg-transparent dark:text-white text-sky-900 p-2 font-bold"
              onClick={() => {
                setCheck(!check);
              }}
            >
              Back
            </button>
          </div>

          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="md:w-1/6 w-1/2 mt-2 flex items-center justify-center rounded-full bg-sky-900 disabled:bg-gray-100 dark:bg-lime-300 dark:disabled:bg-zinc-800 text-white dark:text-black p-2 font-bold"
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
              Submit
            </button>
          </div>
          
        </>
      )}
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
