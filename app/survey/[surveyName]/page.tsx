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
import { TextInput } from "../../components/TextInput";
const { Title, Paragraph } = Typography;

export default function SurveyComponent({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [surveyUsers, setSurveyUsers] = useState<SurveyUsers>();
  const router = useRouter();

  const [isLoading, message] = useFetch<SurveyUsers | undefined>({
    url: `/api/survey/${surveyName}/users`,
    setData: setSurveyUsers,
  });

  return (
    <>
      <Title level={4}>Survey: {decodeURI(surveyName)}</Title>
      <Divider />
      <TextInput
        title="Create new participant"
        inputPlaceholder="Name of participant"
        onClick={(newValue) => {
          const body: PostUserRequestBody = {
            userName: newValue,
          };
          sendData({
            url: `/api/survey/${surveyName}/user`,
            method: "POST",
            body,
            setData: setSurveyUsers,
          });
        }}
      />
      <Divider />
      <Title level={5}>Participants</Title>
      {isLoading ? (
        <Paragraph>Loading participants...</Paragraph>
      ) : (
        !surveyUsers && <Paragraph>Something went wrong: {message}</Paragraph>
      )}
      {surveyUsers && (
        <Space direction="vertical">
          {surveyUsers.map(({ name }) => (
            <Button
              key={name}
              block={true}
              onClick={() => {
                router.push(`/survey/${surveyName}/voting/${name}`);
              }}
            >
              {name}
            </Button>
          ))}
        </Space>
      )}
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
