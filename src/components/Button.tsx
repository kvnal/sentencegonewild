import { Devvit } from "@devvit/public-api";

export interface StyledButtonProps {
  height: any;
  width: any;
  onPress: any;
  style: {
    darkBorderColor: string;
    lightBorderColor: string;
    darkBackgroundColor: string;
    lightBackgroundColor: string;
    lightTextColor: string;
    darkTextColor: string;
  };
  text: string;
}
const StyledButton = ({
  height,
  width,
  onPress,
  style,
  text,
}: StyledButtonProps): JSX.Element => {
  return (
    <hstack
      height={height}
      width={width}
      onPress={onPress}
      border="thin"
      lightBorderColor={style.lightBorderColor}
      darkBorderColor={style.darkBorderColor}
      darkBackgroundColor={style.darkBackgroundColor}
        lightBackgroundColor={style.lightBackgroundColor}
      cornerRadius="full"
    >
      <hstack
        height="100%"
        width="100%"
        padding="small"
        gap="small"
        alignment="middle center"
        cornerRadius="full"
        darkBackgroundColor={style.darkBackgroundColor}
        lightBackgroundColor={style.lightBackgroundColor}
      >
        <text lightColor={style.lightTextColor} darkColor={style.darkTextColor} weight="bold">
          {text}
        </text>
      </hstack>
    </hstack>
  );
};

export default StyledButton;
