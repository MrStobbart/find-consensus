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
const { Title, Paragraph } = Typography;

const gridStyle: CSSProperties = {
  width: "100%",
  cursor: "pointer",
};

export default function StartPage() {
  const router = useRouter();
  const [surveyName, setSurveyName] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [inputHasError, setInputHasError] = useState(false);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  return (
    <>
      <Card title="Create a new survey">
        <Space direction="vertical">
          <Input
            placeholder="Title of your survey"
            value={surveyName}
            onChange={({ target: { value } }) => {
              setSurveyName(value);
              if (value.length > 0) {
                setInputHasError(false);
              }
            }}
            status={inputHasError ? "error" : undefined}
          />
          <Button
            onClick={() => {
              if (surveyName.length === 0) {
                setInputHasError(true);
              } else {
                const body: PostSurveyRequestBody = { name: surveyName };
                sendData({
                  url: "/api/survey",
                  method: "POST",
                  body,
                  setData: setSurveys,
                });
              }
            }}
          >
            Create
          </Button>
        </Space>
      </Card>
      <Divider />
      {isLoading ? (
        <Paragraph>Loading existing surveys...</Paragraph>
      ) : (
        <Card title="Current surveys">
          {surveys.map((survey, index) => (
            <Card.Grid
              style={gridStyle}
              key={survey.name + index}
              onClick={() => {
                router.push(`/survey/${encodeURI(survey.name)}`);
              }}
            >
              {survey.name}
            </Card.Grid>
          ))}
        </Card>
      )}
    </>
  );
}
