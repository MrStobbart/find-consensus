"use client";

import { useEffect, useState } from "react";
import { ServerResponse } from "./types";

export function useFetch<T>({ url }: { url: string }) {
  const [data, setData] = useState<T>();
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((response: ServerResponse<T>) => {
        if (response.successful) {
          setData(response.data);
        }
        setMessage(response.message);
        setLoading(false);
      });
  }, [url]);
  return { data, isLoading, message };
}
