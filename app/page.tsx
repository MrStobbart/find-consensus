"use client";

import { useEffect, useState } from "react";
import { sendData, useFetch } from "./clientHelpers";
import { Survey } from "./types";
import Button from "antd/es/button";
import Input from "antd/es/input";
import { useRouter } from "next/navigation";
import { PostSurveyRequestBody } from "./api/survey/route";

export default function StartPage() {
  const router = useRouter();
  const [surveyName, setSurveyName] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const [isLoading] = useFetch<Survey[]>({
    url: "/api/surveys",
    setData: setSurveys,
  });

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
        Create survey
      </Button>
      {isLoading ? (
        <p>Loading existing surveys...</p>
      ) : (
        <div>
          <p>Current Surveys:</p>
          {surveys.map((survey, index) => (
            <Button
              key={survey.name + index}
              onClick={() => {
                router.push(`/survey/${survey.name}`);
              }}
            >
              {survey.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
