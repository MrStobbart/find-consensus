import { Option, Options, Vote, VoteValue } from "../../../../types";
import Button from "antd/es/button";
import { Dispatch, SetStateAction, useState } from "react";
import { sendData } from "../../../../clientHelpers";
import { PutVoteRequestBody } from "../../../../api/survey/[surveyName]/[userName]/vote/route";
import Paragraph from "antd/es/typography/Paragraph";
import Space from "antd/es/space";
import { DeleteOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal";

type Opposition = {
  value: VoteValue;
  color: string;
};

export const oppositions: Opposition[] = [
  { value: 0, color: "#22C21E" },
  { value: 1, color: "#6BD643" },
  { value: 2, color: "#9CE040" },
  { value: 3, color: "#C9EE39" },
  { value: 4, color: "#EBEB23" },
  { value: 5, color: "#F0D12D" },
  { value: 6, color: "#FFB60C" },
  { value: 7, color: "#FF9819" },
  { value: 8, color: "#FF771F" },
  { value: 9, color: "#FF571E" },
  { value: 10, color: "#EC100D" },
];

type OptionVoteProps = {
  option: Option;
  surveyName: string;
  userName: string;
  setVotes: Dispatch<SetStateAction<Vote[]>>;
  votes: Vote[];
};

export default function OptionVote({
  option,
  surveyName,
  userName,
  votes,
  setVotes,
}: OptionVoteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const voteIndex = votes.findIndex((vote) => vote.option.name === option.name);
  const currentVoteValue = votes[voteIndex]?.value;

  const setData = (newValue: number) => {
    const body: PutVoteRequestBody = {
      option,
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

  const deleteOption = () => {
    sendData({
      url: `/api/survey/${surveyName}/option`,
      method: "DELETE",
      body: votes[voteIndex],
      setData: setVotes,
      clientUpdater(votes, voteToDelete) {
        return votes?.filter(
          (vote) => vote.option.name !== voteToDelete.option.name
        );
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
        <Button
          icon={<DeleteOutlined />}
          type="text"
          shape="circle"
          onClick={() => setIsModalOpen(true)}
        />
      </Space>
      <Modal
        title={`Do you want to delete option "${option.name}"?`}
        open={isModalOpen}
        onOk={deleteOption}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
