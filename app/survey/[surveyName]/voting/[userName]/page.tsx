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

export default function SurveyVoting({
  params: { surveyName, userName },
}: {
  params: { surveyName: string; userName: string };
}) {
  const [options, setOptions] = useState<Options>([]);
  const [votes, setVotes] = useState<Votes>([]);

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
      <TextInput
        title="Create a new option"
        inputPlaceholder="Name of the option"
        onClick={(newValue) => {
          const body: PostOptionRequestBody = { optionName: newValue };
          sendData({
            url: `/api/survey/${surveyName}/option`,
            method: "POST",
            body,
            setData: setOptions,
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
    </>
  );
}
