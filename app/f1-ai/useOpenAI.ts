import OpenAI from "openai";
import { useCallback, useMemo, useState } from "react";

export const useOpenAI = (apiKey?: string) => {
  const openai = useMemo(
    () =>
      new OpenAI({
        apiKey: apiKey ?? process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      }),
    [apiKey]
  );
  const [thread, setThread] = useState<OpenAI.Beta.Thread | null>(null);
  const [messages, setMessages] = useState<
    Array<OpenAI.Beta.Threads.Message> | undefined
  >(undefined);
  const [processing, setProcessing] = useState<boolean>(false);

  const createThread = useCallback(
    async (initialPrompt: string | undefined) => {
      const newThread = await openai.beta.threads.create({
        messages: initialPrompt
          ? [
              {
                role: "user",
                content: initialPrompt,
              },
            ]
          : [],
      });

      setThread(newThread);

      if (initialPrompt) {
        const run = await openai.beta.threads.runs.createAndPoll(newThread.id, {
          assistant_id: "asst_8ONMxCeV4jBtd5G8oTaMapBw",
        });

        if (run.status === "completed") {
          const messages = await openai.beta.threads.messages.list(
            run.thread_id
          );
          setMessages(messages.data);
          return {
            response: messages.data,
            thread: newThread,
          };
        }
      }
      return {
        response: undefined,
        thread: newThread,
      };
    },
    [openai]
  );

  const sendMessage = useCallback(
    async (
      threadId: string,
      content: string,
      role: "user" | "assistant" = "user"
    ) => {
      const message = await openai.beta.threads.messages.create(threadId, {
        role,
        content,
      });

      setMessages((messages) => [...(messages ?? []), message]);
    },
    [openai]
  );

  const run = useCallback(
    async (threadId: string) => {
      setProcessing(true);
      const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: "asst_8ONMxCeV4jBtd5G8oTaMapBw",
      });

      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        setMessages(messages.data.reverse());
        setProcessing(false);
        return messages.data.reverse();
      } else {
        setProcessing(false);
        console.warn("Thread run failed");
      }
    },
    [openai]
  );

  return {
    createThread,
    sendMessage,
    run,
    thread,
    messages,
    processing,
  };
};
