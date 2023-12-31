"use client";

import { useState } from "react";
import { useFetch } from "../../../clientHelpers";
import { Results } from "../../../types";
import Title from "antd/es/typography/Title";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";
import Button from "antd/es/button";
import { oppositions } from "../voting/[userName]/optionVote";
import Paragraph from "antd/es/typography/Paragraph";
import { LoadingOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import Table from "antd/es/table";

export default function Results({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [results, setResults] = useState<Results>();
  const [isLoading] = useFetch<Results | undefined>({
    url: `/api/survey/${surveyName}/results`,
    setData: setResults,
  });

  console.log(results);

  if (isLoading) return <LoadingOutlined />;

  if (results === undefined) return <Paragraph>No results available</Paragraph>;

  const { options, users, votes } = results;

  const optionsWithResults = options
    .map((option) => {
      const usersThatHaveVoted: string[] = [];
      const votesForOption = votes
        .filter(
          (vote) => vote.option.name === option.name && vote.value !== null
        )
        .map((vote) => {
          usersThatHaveVoted.push(vote.userName);
          return vote;
        });

      const missingUserNames = users
        .filter(
          (user) =>
            !usersThatHaveVoted.some(
              (userThatHasVoted) => userThatHasVoted === user.name
            )
        )
        .map(({ name }) => name);

      console.log(usersThatHaveVoted);

      const hasVotes = votesForOption.length > 0;

      const average = hasVotes
        ? votesForOption.reduce((prev, curr) => prev + curr.value!, 0) /
          votesForOption.length
        : 10;
      return {
        optionName: option.name,
        average,
        votesForOption,
        hasVotes,
        missingUserNames,
      };
    })
    .sort((prev, next) => prev.average - next.average);

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
          <Title level={5}>Missing participants</Title>
        </Col>
      </Row>

      {optionsWithResults.map(
        ({
          optionName,
          average,
          votesForOption,
          hasVotes,
          missingUserNames,
        }) => {
          const color = oppositions.find(
            ({ value }) => average <= value
          )?.color;
          return (
            <div key={optionName}>
              <Divider />
              <Row>
                <Col span={8}>
                  <Paragraph disabled={missingUserNames.length > 0}>
                    {optionName}
                  </Paragraph>
                </Col>
                <Col span={8}>
                  {hasVotes ? (
                    <Tooltip
                      placement="bottom"
                      title={
                        <Table
                          size="small"
                          pagination={false}
                          dataSource={votesForOption}
                          columns={[
                            {
                              title: "User",
                              dataIndex: "userName",
                              key: "userName",
                            },
                            {
                              title: "Vote",
                              dataIndex: "value",
                              key: "value",
                              align: "center",
                            },
                          ]}
                        />
                      }
                      color="white"
                    >
                      <Button
                        style={{
                          backgroundColor: color + "44",
                        }}
                      >
                        {Math.round(average * 10) / 10}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Paragraph>No votes</Paragraph>
                  )}
                </Col>
                <Col span={8}>{missingUserNames.join(", ")}</Col>
              </Row>
            </div>
          );
        }
      )}
    </>
  );
}

// <Tooltip
//                       placement="bottom"
//                       title={
//                         <List
//                           size="small"
//                           dataSource={votesForOption}
//                           bordered
//                           renderItem={({ userName, value }) => (
//                             <List.Item>
//                               {userName}: {value}
//                             </List.Item>
//                           )}
//                         ></List>
//                       }
//                       color="white"
//                     ></Tooltip>
