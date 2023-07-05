"use client";

import { useState } from "react";
import { useFetch } from "./clientHelpers";
import { Survey } from "./types";
import { useRouter } from "next/navigation";
import { Input, Button } from "antd";

export default function StartPage() {
  const router = useRouter();
  const [surveyName, setSurveyName] = useState("");

  const { data, isLoading } = useFetch<Survey[]>({
    url: "/api/surveys",
  });
  const surveys = data || [];

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
          fetch("/api/survey/create?name=" + surveyName)
            .then((res) => res.json())
            .then((r) => console.log(r))
            .catch((e) => console.log(e));
          console.log("Create survey");
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
