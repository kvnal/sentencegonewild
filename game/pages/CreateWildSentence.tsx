import { useState } from "react";
import DOMPurify from "dompurify";
import ResizingTextArea from "../components/ResizableTextarea";
import { sendToDevvit } from "../utils";

export const CreatePage = () => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const cleanCreateSentence = (value: string): string => {
    //Fix trailing space
    let trimmedInput = value.trim();
    // Fix multiple underscores
    let underscoreFixed = trimmedInput.replace("/_+/g", "_");
    let sanitized = DOMPurify.sanitize(underscoreFixed, {
      USE_PROFILES: { html: true },
    });

    return sanitized;
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-center p-8 dark:bg-black bg-amber-50">
      <div
        className={
          "relative z-20 mt-2 text-left text-md w-full dark:text-white text-black"
        }
      >
        Create a new Wild Sentence
      </div>
      <div className="flex mt-8 flex-wrap">
        <ResizingTextArea
          value={value}
          onChange={(event) => {
            setError(false);
            setValue(event.target.value);
          }}
          placeholder="Click to type!"
        />
      </div>

      <p className="mb-4 mt-2 text-left text-sm w-full dark:text-sky-300 text-gray-600">
        to create an input box in your sentence add a single "_" (underscore).
      </p>

      <div className="flex justify-center w-full">
        <button
          type="submit"
          className={`md:w-1/6 w-1/2 flex items-center justify-center rounded-full  p-2 font-bold mt-3 ${
            error
              ? "bg-red-500 text-black"
              : "bg-sky-900 dark:bg-lime-300  text-white dark:text-black"
          }`}
          onClick={() => {
            const sanitisedValue: string = cleanCreateSentence(value);
            if (sanitisedValue === "") {
              setError(true);
            } else {
              sendToDevvit({
                // Send completed message to Devvit
                type: "SUBMIT_SENTENCE",
                payload: {
                  newSentence: sanitisedValue,
                },
              });
            }
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
};
