"use client";

// https://github.com/ant-design/ant-design/discussions/43348#discussioncomment-6349922
import Button from "antd/es/button";
import Col from "antd/es/col";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Row from "antd/es/row";
import { useEffect, useState } from "react";
import { Option, Vote } from "../../../types";
import { Socket, io } from "socket.io-client";

type Opposition = {
  value: Vote;
  color: string;
  //   tooltip: string; // TODO
};

const oppositions: Opposition[] = [
  { value: 0, color: "#78BE14" },
  { value: 1, color: "#86B712" },
  { value: 2, color: "#93B010" },
  { value: 3, color: "#A1AA0E" },
  { value: 4, color: "#AEA30C" },
  { value: 5, color: "#BC9C0A" },
  { value: 6, color: "#C99508" },
  { value: 7, color: "#D78E06" },
  { value: 8, color: "#E48804" },
  { value: 9, color: "#F28102" },
  { value: 10, color: "#FF7A00" },
];

let socket: Socket;

export default function SurveyVoting({
  params: { name },
}: {
  params: { name: string };
}) {
  const [newOptionName, setNewOptionName] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      console.log("socket update", msg);

      setOptions(msg);
    });
  };

  const addOption = () => {
    if (newOptionName.length > 0) {
      const newOptions = [...options];
      newOptions.push({ name: newOptionName, votes: {} });

      setNewOptionName("");
      setOptions(newOptions);
      socket.emit("input-change", newOptions);
    } else {
      console.error("Provide a name first");
    }
  };

  const userName = "marek";
  return (
    <>
      {options.map((option, index) => {
        return (
          <Row key={option.name + index}>
            <Col span={6}>{option.name}</Col>
            <Col span={18}>
              <div>
                <Radio.Group
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setOptions((oldOptions) => {
                      const options = [...oldOptions];
                      if (options[index].votes[userName] === undefined) {
                        options[index].votes = {
                          ...options[index].votes,
                          [userName]: newValue as Vote,
                        };
                      } else {
                        options[index].votes[userName] = newValue as Vote;
                      }

                      console.log("new options");
                      console.log({ newValue, options });

                      return options;
                    });
                  }}
                  defaultValue="a"
                >
                  {oppositions.map(({ value, color }) => (
                    <Radio.Button
                      value={value}
                      key={value}
                      style={{ backgroundColor: color }}
                    >
                      {value}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            </Col>
          </Row>
        );
      })}

      <Row>
        <Input
          placeholder="Name of the option"
          value={newOptionName}
          onChange={(e) => setNewOptionName(e.target.value)}
        />
        <Button onClick={() => addOption()}>Create Option</Button>
      </Row>
    </>
  );
}
