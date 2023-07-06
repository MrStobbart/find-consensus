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

export default function SurveyVoting({
  params: { surveyName, userName },
}: {
  params: { surveyName: string; userName: string };
}) {
  const [newOptionName, setNewOptionName] = useState("");
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

  console.log({ votes });

  const addOption = () => {
    if (newOptionName.length > 0) {
      const body: PostOptionRequestBody = { optionName: newOptionName };
      sendData({
        url: `/api/survey/${surveyName}/option`,
        method: "POST",
        body,
        setData: setOptions,
      });

      setNewOptionName("");
    } else {
      console.error("Provide a name first");
    }
  };

  return (
    <>
      {isLoading || isLoadingVotes ? (
        <p>Loading...</p>
      ) : (
        options.map((option, index) => (
          <OptionVote
            key={option.name + index}
            surveyName={surveyName}
            userName={userName}
            option={option}
            votes={votes}
            setVotes={setVotes}
          />
        ))
      )}

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
