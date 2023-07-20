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
import { ItemDisplay } from "./components/ItemDisplay";
import Link from "antd/es/typography/Link";
const { Title, Paragraph } = Typography;

export default function StartPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  // TODO validate uniqueness of survey names
  return (
    <>
      <Title level={4}>Find consensus app</Title>
      <Paragraph>
        Use this app to find consensus in a group while finding the solution
        with the lowest accumulated resistance. Read more about the process
        here:{" "}
        <Link target="_blank" href="https://sk-prinzip.eu/methode/">
          https://sk-prinzip.eu/methode/
        </Link>
      </Paragraph>
      <Paragraph>
        The whole app has no authentication. The reason for this is, to remove
        as many barries as possible. Be mindful which information you put in the
        app.
      </Paragraph>
      <Paragraph>
        This app was created in a hackathon with some cleanup and probably still
        has lots of bugs. Please report on{" "}
        <Link
          href="https://github.com/MrStobbart/find-consensus/issues"
          target="_blank"
        >
          GitHub
        </Link>
      </Paragraph>
      <Divider />
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
            clientUpdater(surveys, newSurvey) {
              const updatedSurveys = [newSurvey, ...(surveys || [])];
              return updatedSurveys;
            },
          });
        }}
      />
      <Divider />
      {isLoading ? (
        <Paragraph>Loading existing surveys...</Paragraph>
      ) : (
        <>
          <Title level={5}>Current surveys</Title>
          <Space direction="vertical">
            {surveys.map((survey, index) => (
              <ItemDisplay
                key={survey.name + index}
                name={survey.name}
                onOpen={() => {
                  router.push(`/survey/${encodeURI(survey.name)}`);
                }}
                onDelete={() =>
                  sendData({
                    url: "/api/survey",
                    method: "DELETE",
                    body: survey,
                    setData: setSurveys,
                    clientUpdater(surveys, surveyToDelete) {
                      return surveys?.filter(
                        (survey) => survey.name !== surveyToDelete.name
                      );
                    },
                  })
                }
              />
            ))}
          </Space>
        </>
      )}
    </>
  );
}
