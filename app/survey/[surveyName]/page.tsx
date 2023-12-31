"use client";

import Button from "antd/es/button";
import { sendData, useFetch } from "../../clientHelpers";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Typography from "antd/es/typography";
import Divider from "antd/es/divider";
import { TextInput } from "../../components/TextInput";
import { ItemDisplay } from "../../components/ItemDisplay";
import { LoadingOutlined } from "@ant-design/icons";
import { SurveyUser } from "../../types";
import { ItemsDisplay } from "../../components/ItemsDisplay";
const { Title, Paragraph } = Typography;

export default function SurveyComponent({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [surveyUsers, setSurveyUsers] = useState<SurveyUser[]>();
  const router = useRouter();

  const [isLoading, message] = useFetch<SurveyUser[] | undefined>({
    url: `/api/survey/${surveyName}/users`,
    setData: setSurveyUsers,
  });

  // TODO? validate uniqueness of rusernames
  return (
    <>
      <Title level={4}>Survey: {decodeURIComponent(surveyName)}</Title>
      <Paragraph>
        Every participant can create new options and should vote on all of them.
      </Paragraph>
      <Divider />
      <TextInput
        title="Create new participant"
        inputPlaceholder="Name of participant"
        maxLength={30}
        width="50%"
        onClick={(newValue) => {
          sendData({
            url: `/api/survey/${surveyName}/user`,
            method: "POST",
            body: { name: newValue },
            setData: setSurveyUsers,
            clientUpdater(users, newUser) {
              const updatedUsers = [newUser, ...(users || [])];
              return updatedUsers;
            },
          });
        }}
      />
      <Divider />
      <Title level={5}>Participants</Title>
      {isLoading ? (
        <LoadingOutlined />
      ) : (
        !surveyUsers && <Paragraph>Something went wrong: {message}</Paragraph>
      )}
      {surveyUsers && (
        <ItemsDisplay>
          {surveyUsers.map((user, index) => (
            <ItemDisplay
              key={user.name}
              name={user.name}
              index={index}
              openLabel="Vote"
              onOpen={() => {
                router.push(
                  `/survey/${surveyName}/voting/${encodeURIComponent(
                    user.name
                  )}`
                );
              }}
              onDelete={() =>
                sendData({
                  url: `/api/survey/${surveyName}/user`,
                  method: "DELETE",
                  body: user,
                  setData: setSurveyUsers,
                  clientUpdater(users, userToDelete) {
                    return users?.filter(
                      (user) => user.name !== userToDelete.name
                    );
                  },
                })
              }
            />
          ))}
        </ItemsDisplay>
      )}
      <Divider />
      <Button
        title="View Results"
        type="primary"
        onClick={() => {
          router.push(`/survey/${surveyName}/results`);
        }}
      >
        See results
      </Button>
    </>
  );
}
