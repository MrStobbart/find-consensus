"use client";

import { CSSProperties, useState } from "react";
import { sendData, useFetch } from "./clientHelpers";
import { Survey } from "./types";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Input from "antd/es/input";
import { useRouter } from "next/navigation";
import { PostSurveyRequestBody } from "./api/survey/route";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Space from "antd/es/space";
import Divider from "antd/es/divider";
import Typography from "antd/es/typography";
import { TextInput } from "./components/TextInput";
const { Title, Paragraph } = Typography;

export default function StartPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  return (
    <>
      <TextInput
        title="Create a new survey"
        inputPlaceholder="Title of your survey"
        onClick={(newValue) => {
          const body: PostSurveyRequestBody = { name: newValue };
          sendData({
            url: "/api/survey",
            method: "POST",
            body,
            setData: setSurveys,
          });
        }}
      />
      <Divider />
      {isLoading ? (
        <Paragraph>Loading existing surveys...</Paragraph>
      ) : (
        <>
          <Title level={4}>Current surveys</Title>
          <Space direction="vertical">
            {surveys.map((survey, index) => (
              <Button
                block={true}
                key={survey.name + index}
                onClick={() => {
                  router.push(`/survey/${encodeURI(survey.name)}`);
                }}
              >
                {survey.name}
              </Button>
            ))}
          </Space>
        </>
      )}
    </>
  );
}
