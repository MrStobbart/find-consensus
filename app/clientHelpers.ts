"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ServerResponse } from "./types";

export function useFetch<T>({
  url,
  setData,
}: {
  url: string;
  setData: Dispatch<SetStateAction<T>>;
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((response: ServerResponse<T>) => {
        if (response.ok) {
          setData(response.data);
        }
        setMessage(response.message);
        setLoading(false);
      });
  }, [url, setData]);
  return [isLoading, message];
}

export function sendData<Req, ResponseData>({
  url,
  setData,
  clientUpdater, // TODO add for other sendData points
  method,
  body,
}: {
  url: string;
  setData: Dispatch<SetStateAction<ResponseData>>;
  clientUpdater?: (oldData: ResponseData, newValue: Req) => ResponseData;
  method: "PUT" | "POST" | "DELETE";
  body: Req;
}) {
  if (clientUpdater) {
    setData((oldData) => clientUpdater(oldData, body));
  }
  fetch(url, {
    method,
    body: JSON.stringify(body),
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((response: ServerResponse<ResponseData>) => {
      if (response.ok) {
        console.log("res ok", response.message);
        setData(response.data);
      } else {
        console.error(response.message);
      }
    })
    .catch((e) => console.error(e));
}
