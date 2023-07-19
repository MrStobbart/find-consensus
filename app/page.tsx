"use client";

import { CSSProperties, useEffect, useState } from "react";
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
import ConfigProvider from "antd/es/config-provider";
import theme from "./themeConfig";

const gridStyle: CSSProperties = {
  width: "25%",
  textAlign: "center",
  cursor: "pointer",
};

const cardStyle: CSSProperties = {
  textAlign: "center",
};

export default function StartPage() {
  const router = useRouter();
  const [surveyName, setSurveyName] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  return (
    <Row justify="center" gutter={[16, 16]}>
      <Col>
        <Card title="Create a new survey" style={cardStyle}>
          <Space direction="vertical" align="center">
            <Input
              placeholder="Title of your survey"
              value={surveyName}
              onChange={(e) => setSurveyName(e.target.value)}
            />
            <Button
              title="Create survey"
              onClick={() => {
                const body: PostSurveyRequestBody = { name: surveyName };
                sendData({
                  url: "/api/survey",
                  method: "POST",
                  body,
                  setData: setSurveys,
                });
              }}
            >
              Create
            </Button>
          </Space>
        </Card>
      </Col>
      <Col>
        {isLoading ? (
          <p>Loading existing surveys...</p>
        ) : (
          <Card title="Current surveys" style={cardStyle}>
            {surveys.map((survey, index) => (
              <Card.Grid
                style={gridStyle}
                key={survey.name + index}
                onClick={() => {
                  router.push(`/survey/${survey.name}`);
                }}
              >
                {survey.name}
              </Card.Grid>
            ))}
          </Card>
        )}
      </Col>
    </Row>
  );
}
