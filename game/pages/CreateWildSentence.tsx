import { useState } from "react";
import ResizingTextArea from "../components/ResizableTextarea";
import { sendToDevvit } from "../utils";

export const CreatePage = () => {
  const [value, setValue] = useState<string>("");
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-4 rounded-lg dark:bg-black bg-amber-50">
      <div
        className={
          "relative z-20 mt-2 text-left text-lg w-full dark:text-white text-black"
        }
      >
        Create a new Wild Sentence
      </div>
      <p className="mb-4 mt-2 text-left text-lg w-full dark:text-white text-black">
        Use single _ (underscore) for empty space and / (forward slash) for new
        line.
      </p>
      <div className="flex flex-wrap">
        <ResizingTextArea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="click to type!"
        />
      </div>

      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="md:w-1/6 w-1/2 mt-2 flex items-center justify-center rounded-full bg-sky-900 disabled:bg-gray-100 dark:bg-lime-300 dark:disabled:bg-zinc-800 text-white dark:text-black p-2 font-bold"
          onClick={() => {
            sendToDevvit({
              // Send completed message to Devvit
              type: "SUBMIT_SENTENCE",
              payload: {
                newSentence: value,
              },
            });
          }}
        >
          Submit ✅
        </button>
      </div>
    </div>
  );
};
