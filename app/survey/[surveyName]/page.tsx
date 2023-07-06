"use client";

import Button from "antd/es/button";
import { sendData, useFetch } from "../../clientHelpers";
import { Options, SurveyUsers } from "../../types";
import { useRouter } from "next/navigation";
import Input from "antd/es/input";
import { useEffect, useState } from "react";
import { PostUserRequestBody } from "../../api/survey/[surveyName]/user/route";

export default function SurveyComponent({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [surveyUsers, setSurveyUsers] = useState<SurveyUsers>();
  const [newUserName, setNewUserName] = useState<string>("");
  const router = useRouter();

  const [isLoading, message] = useFetch<SurveyUsers | undefined>({
    url: `/api/survey/${surveyName}/users`,
    setData: setSurveyUsers,
  });

  console.log(surveyUsers);

  return (
    <div>
      <p>Survey</p>
      <p>{surveyName}</p>
      {isLoading ? (
        <p>Loading users...</p>
      ) : !surveyUsers ? (
        <p>Something went wrong: {message}</p>
      ) : (
        <div>
          {surveyUsers.map(({ name }) => (
            <Button
              key={name}
              onClick={() => {
                router.push(`/survey/${surveyName}/voting/${name}`);
              }}
            >
              {name}
            </Button>
          ))}
        </div>
      )}
      <p>Create new user</p>
      <Input
        placeholder="User name"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <Button
        title="Create new user"
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
            console.error("You must input a username"); // TODO
          }
        }}
      >
        Create user
      </Button>
      <Button
        title="View Results"
        onClick={() => {
          router.push(`/survey/${surveyName}/results`);
        }}
      >
        See results
      </Button>
    </div>
  );
}
