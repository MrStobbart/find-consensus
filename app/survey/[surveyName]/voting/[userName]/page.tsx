"use client";

// https://github.com/ant-design/ant-design/discussions/43348#discussioncomment-6349922
import Button from "antd/es/button";
import { use, useEffect, useState } from "react";
import { Options, Vote } from "../../../../types";
import { sendData, useFetch } from "../../../../clientHelpers";
import { PostOptionRequestBody } from "../../../../api/survey/[surveyName]/option/route";
import OptionVote from "./optionVote";
import Divider from "antd/es/divider";
import Title from "antd/es/typography/Title";
import { TextInput } from "../../../../components/TextInput";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";

export default function SurveyVoting({
  params: { surveyName, userName },
}: {
  params: { surveyName: string; userName: string };
}) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const router = useRouter();

  const [isLoading] = useFetch<Vote[]>({
    url: `/api/survey/${surveyName}/${userName}/votes`,
    setData: setVotes,
  });

  return (
    <>
      <Title level={4}>
        Voting for participant {decodeURIComponent(userName)}
      </Title>
      <Paragraph>
        Here you can see all currently created options declare you restiance
        against the different possibilites.
      </Paragraph>
      <Paragraph>
        After every participant has voted the option with the lowest total
        (accumulated from all participants) resistance is probably the best
        option for the group.
      </Paragraph>
      <Paragraph>
        Declaring the same resistance for all options has the same effect as
        abstaining from the voting overall. It is therefore recommended to think
        about differences.
      </Paragraph>
      <Divider />
      <TextInput
        title="Create a new option"
        inputPlaceholder="Name of the option"
        maxLength={50}
        onClick={(newValue) => {
          const body: PostOptionRequestBody = {
            option: { name: newValue },
            userName,
            value: null,
          };
          sendData({
            url: `/api/survey/${surveyName}/option`,
            method: "POST",
            body,
            setData: setVotes,
            clientUpdater(votes, newVote) {
              const updatedOptions = [newVote, ...(votes || [])];
              return updatedOptions;
            },
          });
        }}
      />
      {isLoading ? (
        <LoadingOutlined />
      ) : (
        votes.map((vote, index) => (
          <div key={vote.option.name + index}>
            <Divider />
            <OptionVote
              surveyName={surveyName}
              userName={userName}
              option={vote.option}
              votes={votes}
              setVotes={setVotes}
            />
          </div>
        ))
      )}
      <Divider />
      <Button
        type="primary"
        onClick={() => router.push(`/survey/${surveyName}`)}
      >
        Back to survey
      </Button>
    </>
  );
}
