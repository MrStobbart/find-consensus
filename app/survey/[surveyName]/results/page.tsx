"use client";

import { useState } from "react";
import { useFetch } from "../../../clientHelpers";
import { Options, Votes } from "../../../types";

export default function Results({
  params: { surveyName },
}: {
  params: { surveyName: string };
}) {
  const [votes, setVotes] = useState<Votes>([]);
  const [options, setOptions] = useState<Options>([]);
  const [isLoadingVotes] = useFetch<Votes>({
    url: `/api/survey/${surveyName}/votes`,
    setData: setVotes,
  });

  const [isLoadingOptions] = useFetch<Options>({
    url: `/api/survey/${surveyName}/options`,
    setData: setOptions,
  });

  if (isLoadingVotes || isLoadingOptions) return <p>Loading votes...</p>;

  return options.map((option) => {
    const votesForOption = votes
      .filter((vote) => vote.optionName === option.name)
      .map((vote) => vote.value);

    const average =
      votesForOption.reduce((prev, curr) => prev + curr, 0) /
      votesForOption.length;
    return (
      <div key={option.name}>
        <p>Option name: {option.name}</p>
        <p>Average: {average}</p>
        <p>Values: {votesForOption.join(", ")}</p>
      </div>
    );
  });
}
