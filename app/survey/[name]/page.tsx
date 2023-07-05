"use client";

import { useFetch } from "../../clientHelpers";
import { Survey } from "../../types";

export default function SurveyComponent({
  params: { name },
}: {
  params: { name: string };
}) {
  const { isLoading, message, data } = useFetch<Survey>({
    url: `/api/survey/${name}`,
  });

  if (isLoading) return <p>Loading survey {name}</p>;

  if (data) {
    return (
      <div>
        <p>Survey</p>
        <p>{data.name}</p>
        {data.options.map((option, index) => (
          <p key={`${option.name}${index}`}>{option.name}</p>
        ))}
      </div>
    );
  }
  return <p>Something went wrong {message}</p>;
}
