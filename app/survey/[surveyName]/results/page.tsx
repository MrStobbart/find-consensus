"use client";

import { useState } from "react";
import { useFetch } from "../../../clientHelpers";
import { Options, VoteValue, Votes } from "../../../types";
import Title from "antd/es/typography/Title";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";
import Button from "antd/es/button";
import { oppositions } from "../voting/[userName]/optionVote";
import Paragraph from "antd/es/typography/Paragraph";

export const revalidate = 0;

export default function Results({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [votes, setVotes] = useState<Votes>([]);
  const [options, setOptions] = useState<Options>([]);
  const [isLoadingVotes] = useFetch<Votes>({
    url: `/api/survey/${surveyName}/votes`,
    setData: setVotes,
  });

  const [isLoadingOptions] = useFetch<Options>({
    url: `/api/survey/${surveyName}/options`,
    setData: setOptions,
  });

  if (isLoadingVotes || isLoadingOptions) return <p>Loading votes...</p>;

  const optionsWithResults = options
    .map((option) => {
      const votesForOption = votes
        .filter(
          (vote) => vote.optionName === option.name && vote.value !== null
        )
        .map((vote) => vote.value) as VoteValue[]; // TODO maybe type ok?

      const hasVotes = votesForOption.length > 0;

      const average = hasVotes
        ? votesForOption.reduce((prev, curr) => prev + curr, 0) /
          votesForOption.length
        : 10;
      return {
        name: option.name,
        average,
        votesForOption,
        hasVotes,
      };
    })
    .sort((prev, next) => prev.average - next.average);

  // TODO maybe show missing participants here
  return (
    <>
      <Row>
        <Col span={8}>
          <Title level={5}>Option name</Title>{" "}
        </Col>
        <Col span={8}>
          <Title level={5}>Average</Title>{" "}
        </Col>
        <Col span={8}>
          <Title level={5}>Votes</Title>
        </Col>
      </Row>

      {optionsWithResults.map(({ name, average, votesForOption, hasVotes }) => {
        return (
          <div key={name}>
            <Divider />
            <Row>
              <Col span={8}>{name}</Col>
              <Col span={8}>
                {hasVotes ? (
                  <Button
                    size="small"
                    style={{
                      color: oppositions.find(({ value }) => average <= value)
                        ?.color,
                    }}
                  >
                    {Math.round(average * 10) / 10}
                  </Button>
                ) : (
                  <Paragraph>No votes</Paragraph>
                )}
              </Col>
              <Col span={8}>{votesForOption.join(", ")}</Col>
            </Row>
          </div>
        );
      })}
    </>
  );
}
