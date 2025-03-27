import React, { ChangeEventHandler } from "react";

const MIN_TEXTAREA_HEIGHT = 10;

interface ResizingTextAreaProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder: string;
}

const ResizingTextArea = (props: ResizingTextAreaProps) => {
  const { value, onChange, placeholder } = props;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  // const [value, setValue] = React.useState<string>("");
  const onTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = onChange;

  React.useLayoutEffect(() => {
    // Reset height - important to shrink on delete

    textareaRef.current!.style.height = "inherit";
    // Set height
    textareaRef.current!.style.height = `${Math.max(
      textareaRef.current!.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [value]);

  return (
    <textarea
      onChange={onTextAreaChange}
      ref={textareaRef}
      style={{
        height: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      }}
      maxLength={200}
      className="text-2xl w-full border-b-2 dark:border-white border-black focus:outline-none dark:text-lime-300 text-sky-900 dark:focus:border-b-sky-400 focus:border-b-sky-400 overflow-hidden"
      value={value}
      placeholder={placeholder}
    />
  );
};

export default ResizingTextArea;
