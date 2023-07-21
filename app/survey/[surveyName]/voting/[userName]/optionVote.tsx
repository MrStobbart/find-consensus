import { Option, Vote, VoteValue, Votes } from "../../../../types";
import Button from "antd/es/button";
import Input from "antd/es/input";
import Col from "antd/es/col";
import Radio from "antd/es/radio";
import Row from "antd/es/row";
import { Dispatch, SetStateAction } from "react";
import { sendData } from "../../../../clientHelpers";
import { PutVoteRequestBody } from "../../../../api/survey/[surveyName]/[userName]/vote/route";
import Paragraph from "antd/es/typography/Paragraph";
import Space from "antd/es/space";

type Opposition = {
  value: VoteValue;
  color: string;
  //   tooltip: string; // TODO
};

export const oppositions: Opposition[] = [
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

type OptionVoteProps = {
  option: Option;
  surveyName: string;
  userName: string;
  setVotes: Dispatch<SetStateAction<Votes>>;
  votes: Votes;
};

export default function OptionVote({
  option,
  surveyName,
  userName,
  votes,
  setVotes,
}: OptionVoteProps) {
  console.log(votes);

  const voteIndex = votes.findIndex((vote) => vote.optionName === option.name);
  const currentVoteValue = votes[voteIndex]?.value;

  const setData = (newValue: number) => {
    const body: PutVoteRequestBody = {
      optionName: option.name,
      value: newValue,
    };
    sendData({
      url: `/api/survey/${surveyName}/${userName}/vote`,
      method: "PUT",
      body,
      setData: setVotes,
      clientUpdater: (oldData, newValue) => {
        const updatedData = [...oldData];
        updatedData[voteIndex] = { ...newValue, userName };
        return updatedData;
      },
    });
  };

  return (
    <>
      <Paragraph>{option.name}</Paragraph>
      <Space wrap={true}>
        {oppositions.map(({ value, color }) => (
          <Button
            shape="circle"
            key={value}
            style={{
              backgroundColor: color + "44",
              borderColor: currentVoteValue === value ? "black" : undefined,
            }}
            onClick={() => setData(value)}
          >
            {value}
          </Button>
        ))}
      </Space>
    </>
  );
}
