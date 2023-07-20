"use client";

// https://github.com/ant-design/ant-design/discussions/43348#discussioncomment-6349922
import Button from "antd/es/button";
import Input from "antd/es/input";
import Col from "antd/es/col";
import Radio from "antd/es/radio";
import Row from "antd/es/row";
import { useEffect, useState } from "react";
import {
  Option,
  Options,
  Survey,
  Vote,
  VoteValue,
  Votes,
} from "../../../../types";
import { sendData, useFetch } from "../../../../clientHelpers";
import { PostOptionRequestBody } from "../../../../api/survey/[surveyName]/option/route";
import OptionVote from "./optionVote";
import Divider from "antd/es/divider";
import Space from "antd/es/space";
import Title from "antd/es/typography/Title";
import { TextInput } from "../../../../components/TextInput";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";

export default function SurveyVoting({
  params: { surveyName, userName },
}: {
  params: { surveyName: string; userName: string };
}) {
  const [options, setOptions] = useState<Options>([]);
  const [votes, setVotes] = useState<Votes>([]);
  const router = useRouter();

  const [isLoading] = useFetch<Options>({
    url: `/api/survey/${surveyName}/options`,
    setData: setOptions,
  });

  const [isLoadingVotes] = useFetch<Votes>({
    url: `/api/survey/${surveyName}/${userName}/votes`,
    setData: setVotes,
  });

  return (
    <>
      <Title level={4}>Voting for participant {userName}</Title>
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
        onClick={(newValue) => {
          const body: PostOptionRequestBody = { name: newValue };
          sendData({
            url: `/api/survey/${surveyName}/option`,
            method: "POST",
            body,
            setData: setOptions,
            clientUpdater(options, newOption) {
              const updatedOptions = [newOption, ...(options || [])];
              return updatedOptions;
            },
          });
        }}
      />
      {isLoading || isLoadingVotes ? (
        <Paragraph>Loading...</Paragraph>
      ) : (
        options.map((option, index) => (
          <div key={option.name + index}>
            <Divider />
            <OptionVote
              surveyName={surveyName}
              userName={userName}
              option={option}
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
