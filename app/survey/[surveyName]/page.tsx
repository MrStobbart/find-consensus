"use client";

import Button from "antd/es/button";
import { sendData, useFetch } from "../../clientHelpers";
import { Options, SurveyUsers } from "../../types";
import { useRouter } from "next/navigation";
import Input from "antd/es/input";
import { useEffect, useState } from "react";
import { PostUserRequestBody } from "../../api/survey/[surveyName]/user/route";
import Typography from "antd/es/typography";
import Space from "antd/es/space";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Divider from "antd/es/divider";
const { Title, Paragraph } = Typography;

export default function SurveyComponent({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [surveyUsers, setSurveyUsers] = useState<SurveyUsers>();
  const [newUserName, setNewUserName] = useState<string>("");
  const [inputHasError, setInputHasError] = useState(false);
  const router = useRouter();

  const [isLoading, message] = useFetch<SurveyUsers | undefined>({
    url: `/api/survey/${surveyName}/users`,
    setData: setSurveyUsers,
  });

  return (
    <>
      <Title level={4}>Survey: {decodeURI(surveyName)}</Title>
      <Divider />
      <Title level={5}>Participants</Title>
      {isLoading ? (
        <Paragraph>Loading participants...</Paragraph>
      ) : (
        !surveyUsers && <Paragraph>Something went wrong: {message}</Paragraph>
      )}
      {surveyUsers && (
        <Row gutter={[8, 8]}>
          {surveyUsers.map(({ name }) => (
            <Col key={name}>
              <Button
                onClick={() => {
                  router.push(`/survey/${surveyName}/voting/${name}`);
                }}
              >
                {name}
              </Button>
            </Col>
          ))}
        </Row>
      )}
      <Divider />
      <Space direction="vertical">
        <Title level={5}>Create new participant</Title>
        <Input
          placeholder="Name of participant"
          value={newUserName}
          onChange={({ target: { value } }) => {
            setNewUserName(value);
            if (value.length > 0) {
              setInputHasError(false);
            }
          }}
          status={inputHasError ? "error" : undefined}
        />
        <Button
          title="Create a new participant"
          onClick={() => {
            if (newUserName.length > 0) {
              const body: PostUserRequestBody = {
                userName: newUserName,
              };
              sendData({
                url: `/api/survey/${surveyName}/user`,
                method: "POST",
                body,
                setData: setSurveyUsers,
              });
              setNewUserName("");
            } else {
              setInputHasError(true);
            }
          }}
        >
          Create
        </Button>
      </Space>
      <Divider />
      <Button
        title="View Results"
        onClick={() => {
          router.push(`/survey/${surveyName}/results`);
        }}
      >
        See results
      </Button>
    </>
  );
}
