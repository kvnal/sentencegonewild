import React from "react";
import DOMPurify from "dompurify";
import { Parser } from "html-to-react";
import ResizingTextArea from "./ResizableTextarea";

interface DynamicInputsProps {
  sentence: string;
  inputValues: {
    [key: string]: string;
  };
  setInputValues: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string;
    }>
  >;
}

export const DynamicInputs: React.FC<DynamicInputsProps> = ({
  sentence,
  inputValues,
  setInputValues,
}) => {
  // Sanitize HTML content
  const sanitizeAndRender = (html: string) => {
    const clean: string = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
    const { parse } = Parser();
    return parse(clean);
  };

  const processSentence = (text: string) => {
    const lines = text.split("/").map((line) => line.trim());

    return lines.map((line, lineIndex) => {
      const parts = line.split("_");

      if (parts.length === 1) {
        return (
          <div
            key={`line-${lineIndex}`}
            className="dark:text-white text-black flex flex-wrap"
          >
            <div className="mt-2 text-2xl text-left">
              {sanitizeAndRender(parts[0])}
            </div>
            {lineIndex === lines.length - 1 && (
              <div className="mx-0 mt-2 w-full">
                <ResizingTextArea
                  value={inputValues[`end-${lineIndex}`] || ""}
                  onChange={(event) =>
                    handleInputChange(`end-${lineIndex}`, event.target.value)
                  }
                  placeholder="Click to type!"
                />
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={`line-${lineIndex}`}
          className="dark:text-white text-black flex flex-wrap"
        >
          {parts.map((part, partIndex) => {
            return (
              <React.Fragment key={`part-${lineIndex}-${partIndex}`}>
                {part != "" && (
                  <div className="mt-2 text-2xl text-left">
                    {sanitizeAndRender(part)}
                  </div>
                )}
                {partIndex < parts.length - 1 && (
                  <div
                    className="mx-0 mt-2 w-full"
                    id={`ResizingTextArea${partIndex}`}
                  >
                    <ResizingTextArea
                      value={inputValues[`${lineIndex}-${partIndex}`] || ""}
                      onChange={(event) =>
                        handleInputChange(
                          `${lineIndex}-${partIndex}`,
                          event.target.value
                        )
                      }
                      placeholder="Click to type!"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    });
  };

  const handleInputChange = (key: string, value: string) => {
    const newValues = {
      ...inputValues,
      [key]: value,
    };
    setInputValues(newValues);
  };

  return (
    <div className="dynamic-inputs-container">{processSentence(sentence)}</div>
  );
};
