import Space from "antd/es/space";
import Title from "antd/es/typography/Title";
import Button from "antd/es/button";
import Input from "antd/es/input";
import { useState } from "react";
import Alert from "antd/es/alert";
import { delimiter } from "../types";

export type TextInputProps = {
  onClick: (inputValue: string) => void;
  title: string;
  inputPlaceholder: string;
  maxLength: number;
  width?: string;
};

export function TextInput({
  onClick,
  title,
  inputPlaceholder,
  maxLength,
  width = "80%",
}: TextInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const validateInput = (input: string) => {
    if (input.length === 0) {
      setError(
        `The ${inputPlaceholder.toLowerCase()} must have at least one character`
      );
      return false;
    }

    if (input.includes(delimiter)) {
      setError(
        `The ${inputPlaceholder.toLowerCase()} can't include ${delimiter}`
      );
      return false;
    }

    if (input.length > maxLength) {
      setError(
        `The ${inputPlaceholder.toLowerCase()} has a maximum of ${maxLength} characters`
      );
      return false;
    }

    setError("");
    return true;
  };

  return (
    <Space direction="vertical" style={{ width }}>
      <Title level={5}>{title}</Title>
      <Input
        placeholder={inputPlaceholder}
        value={input}
        onChange={({ target: { value } }) => {
          setError("");
          setInput(value);
        }}
        status={error ? "error" : undefined}
        showCount={true}
        maxLength={maxLength}
      />
      {error.length > 0 && <Alert message={error} type="error" />}
      <Button
        onClick={() => {
          if (validateInput(input)) {
            onClick(input);
            setInput("");
          }
        }}
      >
        Create
      </Button>
    </Space>
  );
}
