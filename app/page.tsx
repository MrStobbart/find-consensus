"use client";

import { useState } from "react";
import { sendData, useFetch } from "./clientHelpers";
import { Survey } from "./types";
import { useRouter } from "next/navigation";
import { PostSurveyRequestBody } from "./api/survey/route";
import Space from "antd/es/space";
import Divider from "antd/es/divider";
import Typography from "antd/es/typography";
import { TextInput } from "./components/TextInput";
import { ItemDisplay } from "./components/ItemDisplay";
import Link from "antd/es/typography/Link";
import { LoadingOutlined } from "@ant-design/icons";
import { ItemsDisplay } from "./components/ItemsDisplay";
const { Title, Paragraph } = Typography;

export default function StartPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  // TODO? validate uniqueness of survey names
  return (
    <>
      <Title level={4}>Find consensus app</Title>
      <Paragraph>
        Use this app to find consensus in a group while finding the solution
        with the lowest accumulated resistance. Read more about the process
        here:
        <br />
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
        maxLength={50}
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
        <LoadingOutlined />
      ) : (
        <>
          <Title level={5}>Current surveys</Title>
          <ItemsDisplay>
            {surveys.map((survey, index) => (
              <ItemDisplay
                key={survey.name + index}
                openLabel="Participate"
                name={survey.name}
                index={index}
                onOpen={() => {
                  router.push(`/survey/${encodeURIComponent(survey.name)}`);
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
          </ItemsDisplay>
        </>
      )}
    </>
  );
}
