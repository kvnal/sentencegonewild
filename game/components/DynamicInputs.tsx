import React from "react";
import DOMPurify from "dompurify";
import { Parser } from "html-to-react";
import ResizingTextArea from "./ResizableTextarea";

interface DynamicInputsProps {
  sentence: string;
  onConsolidatedChange?: (result: string) => void;
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
  onConsolidatedChange,
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

  // Function to get the consolidated sentence with validation
  const getConsolidatedSentence = (newValues: {
    [key: string]: string;
  }): string | undefined => {
    const lines = sentence.split("/").map((line) => line.trim());
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
    console.log(`Errors: ${JSON.stringify(newErrors, null, 2)} ${Object.values(newErrors).some((hasError) => hasError)}`);
    if (!Object.values(newErrors).every((hasError) => !hasError)) { 
      return "";
    }
    return result
  };
  const processSentence = (text: string) => {
    const lines = text.split("/").map((line) => line.trim());

    return lines.map((line, lineIndex) => {
      const parts = line.split("_");

      if (parts.length === 1) {
        return (
          <div key={`line-${lineIndex}`} className="line-container">
            {sanitizeAndRender(parts[0])}
            {lineIndex === lines.length - 1 && (
              <div style={{ marginTop: "8px" }}>
                <ResizingTextArea
                  value={inputValues[`end-${lineIndex}`] || ""}
                  onChange={(event) =>
                    handleInputChange(`end-${lineIndex}`, event.target.value)
                  }
                  placeholder="click to type!"
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
                  <div className="mx-2 mt-2">{sanitizeAndRender(part)}</div>
                )}
                {partIndex < parts.length - 1 && (
                  <div
                    className="mx-4 mt-2 w-full"
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
                      placeholder="click to type!"
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

    // Call the callback with the consolidated sentence whenever inputs change
    if (onConsolidatedChange) {
      const consolidated = getConsolidatedSentence(newValues);
      if (consolidated) onConsolidatedChange(consolidated);
    }
  };

  return (
    <div className="dynamic-inputs-container">{processSentence(sentence)}</div>
  );
};
