"use client";

import Button from "antd/es/button";
import { sendData, useFetch } from "../../clientHelpers";
import { SurveyUsers } from "../../types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Typography from "antd/es/typography";
import Space from "antd/es/space";
import Divider from "antd/es/divider";
import { TextInput } from "../../components/TextInput";
import { ItemDisplay } from "../../components/ItemDisplay";
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

  // TODO validate uniqueness of rusernames
  return (
    <>
      <Title level={4}>Survey: {decodeURI(surveyName)}</Title>
      <Paragraph>
        Every participant can create new options and should vote on all of them.
      </Paragraph>
      <Divider />
      <TextInput
        title="Create new participant"
        inputPlaceholder="Name of participant"
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
        <Paragraph>Loading participants...</Paragraph>
      ) : (
        !surveyUsers && <Paragraph>Something went wrong: {message}</Paragraph>
      )}
      {surveyUsers && (
        <Space direction="vertical">
          {surveyUsers.map((user) => (
            <ItemDisplay
              key={user.name}
              name={user.name}
              onOpen={() => {
                router.push(`/survey/${surveyName}/voting/${user.name}`);
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
        </Space>
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
