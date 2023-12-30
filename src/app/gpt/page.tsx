"use client";

import useAutoScroll from "@/hooks/useAutoScroll";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import {
  ArrowBack as ArrowBackIcon,
  ClearOutlined as ClearOutlinedIcon,
  ScheduleSendOutlined as ScheduleSendOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, Platform } from "./model";

const roleName = {
  user: "我",
  assistant: "BT",
};

const platforms: Platform[] = [
  { name: "GPT3.5", value: "azure" },
  { name: "文心", value: "wenxin" },
];

export default function GPT() {
  // 对话列表
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [platformIdx, setPlatformIdx] = useState(0);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [gptAnswerLoading, setGPTAnswerLoading] = useState(false);

  const previewDomRef = useRef<any>();
  const [startScroll, stopScroll] = useAutoScroll(previewDomRef);

  useEffect(() => {
    if (gptAnswerLoading) {
      startScroll();
    }
    return () => {
      stopScroll();
    };
  }, [gptAnswerLoading]);

  const addMessage = (content: string, chatMessages: ChatMessage[]) => {
    const uniqueId = nanoid();
    setChatMessages((chatMessages) => {
      return [
        ...chatMessages,
        {
          id: uniqueId,
          role_name: roleName["user"],
          role: "user",
          content: content,
        },
      ];
    });
  };

  const switchPlatform = () => {
    setPlatformIdx((platformIdx + 1) % platforms.length);
  };

  const addMesage = () => {
    setChatMessages([
      ...chatMessages,
      {
        id: nanoid(),
        role_name: roleName["user"],
        role: "user",
        content: inputMsg,
      },
      {
        id: nanoid(),
        role_name: roleName["assistant"],
        role: "assistant",
        content: "",
      },
    ]);
    setInputMsg("");
  };

  const gptAnwser = (chatMessages: ChatMessage[]) => {
    setGPTAnswerLoading(true);
    // addMessage(inputMsg);
    const messages = chatMessages.map((cmsg) => {
      return { role: cmsg.role, content: cmsg.content };
    });
    console.info(messages);
    // setGPTAnswerLoading(false);
    // return;
    let respString = "";
    fetchEventSource(
      "https://vam-api-dev.yilanvaas.cn/api/aitext/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          imark: "d4jr7nk34E5G",
          apifmt: "standard",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          platform: platforms[platformIdx].value,
        }),
        mode: "cors",
        onmessage(event) {
          try {
            // 表示整体结束
            if (event.data === "[DONE]") {
              setGPTAnswerLoading(false);
              return;
            }
            const jsonData = JSON.parse(event.data);
            if (jsonData.content !== undefined) {
              respString += jsonData.content;
              setAnswer(respString);

              let lastMsg = chatMessages[chatMessages.length - 1];
              if (lastMsg !== undefined && lastMsg.role !== "user") {
                lastMsg.content = respString;
                setChatMessages(chatMessages);
              }

              console.info(respString);
            }
          } catch (error) {
            console.log(error);
          }
        },
        onerror(err) {
          console.log(err);
        },
      }
    );
  };

  useEffect(() => {
    let lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg !== undefined && lastMsg.role !== "user") {
      gptAnwser(chatMessages);
    } else if (lastMsg !== undefined) {
      console.log("render: <%s>: %s ", lastMsg.role, lastMsg.content);
    } else {
      console.log("render nothing");
    }
  }, [chatMessages]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#ffffff",
      }}
    >
      <Paper
        ref={previewDomRef}
        sx={{
          margin: "10px 10px 0 10px",
          padding: "5px",
          width: "80%",
          height: "100%",
          flex: 1,
          // overflowY: "scroll",
          // position: "sticky",
          bottom: 0,
          overflow: "auto",
        }}
        elevation={4}
      >
        {chatMessages.map((cmsg: ChatMessage) => (
          <Paper
            component="form"
            // variant={"outlined"}
            elevation={0}
            sx={{
              display: "flex",
              // alignItems: "flex-start",
              // backgroundColor: item.role === "user" ? "red" : "#01f74388",
              margin: "5px",
            }}
            key={cmsg.id}
          >
            <Stack
              direction={cmsg.role === "user" ? "row-reverse" : "row"}
              sx={{ width: "100%", alignItems: "flex-start" }}
              justifyContent={"flex-start"}
              spacing={2}
            >
              {/* <Avatar>{cmsg.role_name}</Avatar> */}

              <Stack
                direction={cmsg.role === "user" ? "row-reverse" : "row"}
                sx={{ width: "80%", alignItems: "flex-start" }}
                justifyContent={"flex-start"}
                spacing={2}
                // sx={{
                //   width: "80%",
                //   flexDirection: item.role === "user" ? "row-reverse" : "row",
                // }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    padding: "5px",
                    backgroundColor:
                      cmsg.role === "user" ? "#7bed9f" : "#ffffff",
                    borderRadius:
                      cmsg.role === "user" ? "5px 0 5px 5px" : "0 5px 5px 5px",
                  }}
                >
                  <Typography whiteSpace={"pre-line"} variant="body1">
                    {cmsg.content}
                  </Typography>
                </Card>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Paper>

      <Paper
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "10px",
          padding: "5px",
          width: "80%",
          height: "200px",
        }}
      >
        <Paper sx={{ display: "flex", height: "30px" }} elevation={0}>
          <Button variant="text" size="small" href="/">
            <ArrowBackIcon />
          </Button>

          <Divider orientation="vertical" variant="middle" flexItem />

          <Button
            onClick={() => {
              addMesage();
            }}
            disabled={gptAnswerLoading}
          >
            {gptAnswerLoading ? (
              <ScheduleSendOutlinedIcon />
            ) : (
              <SendOutlinedIcon />
            )}
          </Button>
          <Button
            color="error"
            onClick={() => {
              setChatMessages([]);
            }}
          >
            <ClearOutlinedIcon />
          </Button>
          <Button color="secondary" onClick={switchPlatform}>
            {platforms[platformIdx].name}
          </Button>
        </Paper>

        <Divider></Divider>

        <InputBase
          autoComplete="off"
          multiline
          value={inputMsg}
          placeholder="你想要问什么。。。"
          minRows={1}
          maxRows={6}
          sx={{ margin: "10px" }}
          onChange={(event: any) => {
            setInputMsg(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              addMesage();
            }
          }}
        />
      </Paper>
    </Box>
  );
}
