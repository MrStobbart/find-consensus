import Space from "antd/es/space";
import Title from "antd/es/typography/Title";
import Button from "antd/es/button";
import Input from "antd/es/input";
import { useState } from "react";

export type TextInputProps = {
  onClick: (inputValue: string) => void;
  title: string;
  inputPlaceholder: string;
};

export function TextInput({
  onClick,
  title,
  inputPlaceholder,
}: TextInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputHasError, setInputHasError] = useState(false);
  return (
    <Space direction="vertical">
      <Title level={5}>{title}</Title>
      <Input
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={({ target: { value } }) => {
          setInputValue(value);
          if (value.length > 0) {
            setInputHasError(false);
          }
        }}
        status={inputHasError ? "error" : undefined}
      />
      <Button
        onClick={() => {
          if (inputValue.length === 0) {
            setInputHasError(true);
          } else {
            onClick(inputValue);
            setInputValue("");
          }
        }}
      >
        Create
      </Button>
    </Space>
  );
}
