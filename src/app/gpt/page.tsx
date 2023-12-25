"use client";

import useAutoScroll from "@/hooks/useAutoScroll";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { HotKeys } from "react-hotkeys";
import {
  AddOutlined as AddIcon,
  ClearOutlined as ClearOutlinedIcon,
  HorizontalRuleOutlined as HorizontalRuleOutlinedIcon,
  ScheduleSendOutlined as ScheduleSendOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Unstable_Grid2 as Grid,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { Completion, Platform } from "./model";

const initCompletions = (): Completion[] => {
  return [
    {
      id: nanoid(),
      role_name: roleName["user"],
      role: "user",
      content: "",
      autoFocus: true,
      mouseOver: false,
    },
  ];
};

const roleName = {
  user: "我",
  assistant: "文仆",
};

const platforms: Platform[] = [
  { name: "GPT3.5", value: "azure" },
  { name: "文心", value: "wenxin" },
];

export default function GPT() {
  // 对话列表
  const [completions, setCompletions] = useState<Completion[]>(
    initCompletions()
  );
  const [gptAnswerLoading, setGPTAnswerLoading] = useState(false);
  const [platformIdx, setPlatformIdx] = useState(0);
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

  const newCompletions = () => {
    setCompletions(initCompletions());
  };

  const addMessage = (): string => {
    const lastRole =
      completions.length === 0
        ? "assistant"
        : completions[completions.length - 1].role;
    const role = reverseRole(lastRole);

    const uniqueId = nanoid();
    const newcomps = completions.map((c) => {
      c.autoFocus = false;
      return c;
    });
    setCompletions([
      ...newcomps,
      {
        id: uniqueId,
        role_name: roleName[role],
        role: role,
        content: "",
        autoFocus: true,
        mouseOver: false,
      },
    ]);

    return uniqueId;
  };

  const delMessage = (id: string) => {
    setCompletions(completions.filter((comp) => comp.id !== id));
  };

  const reverseRole = (role: string) => {
    return role === "user" ? "assistant" : "user";
  };

  const changeRole = (id: string) => {
    const nextComps = completions.map((comp) => {
      if (comp.id === id) {
        comp.role = reverseRole(comp.role);
      }
      return comp;
    });
    setCompletions(nextComps);
  };

  const changeContent = (id: string, content: string) => {
    setCompletions((completions) => {
      return completions.map((comp) => {
        if (comp.id === id) {
          comp.content = content;
        }
        return comp;
      });
    });
  };

  const mouseStatus = (id: string, status: boolean) => {
    const nextComps = completions.map((comp) => {
      if (comp.id === id) {
        comp.mouseOver = status;
      }
      return comp;
    });
    setCompletions(nextComps);
  };

  const switchPlatform = () => {
    setPlatformIdx((platformIdx + 1) % platforms.length);
  };

  const gptAnwser = () => {
    setGPTAnswerLoading(true);
    const messages = completions.map((comp) => {
      return { role: comp.role, content: comp.content };
    });
    const id = addMessage();
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
              changeContent(id, respString);
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

  const handleKeydown = (e: KeyboardEvent) => {
    // let isMac = navigator.userAgentData.platform === "macOS";
    let ctrled = e.ctrlKey || e.metaKey;
    if (ctrled && e.code === "Enter") {
      gptAnwser();
    } else if (ctrled && e.code === "KeyJ") {
      addMessage();
    } else if (ctrled && e.code === "KeyH") {
      newCompletions();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.removeEventListener("keydown", handleKeydown);
    };
  }, [completions]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
        flexGrow: 1,
        justifyContent: "center",
        flexDirection: "column",
        // padding: "15px",
        backgroundColor: "#ffffff",
      }}
    >
      <Paper
        ref={previewDomRef}
        sx={{
          margin: "10px",
          padding: "5px",
          height: "100%",
          flex: 1,
          // overflowY: "scroll",
          position: "sticky",
          bottom: 0,
          overflow: "auto",
        }}
        elevation={4}
      >
        {completions.map((item: Completion) => (
          <Paper
            component="form"
            variant={item.role === "user" ? "elevation" : "outlined"}
            elevation={0}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "flex-start",
              // backgroundColor: item.role === "user" ? "red" : "#01f74388",
              margin: "5px",
            }}
            key={item.id}
            onMouseOver={() => {
              mouseStatus(item.id, true);
            }}
            onMouseLeave={() => {
              mouseStatus(item.id, false);
            }}
          >
            <Button
              onClick={() => {
                changeRole(item.id);
              }}
            >
              {item.role_name}
            </Button>

            <InputBase
              autoComplete="off"
              value={item.content}
              multiline
              minRows={1}
              // maxRows={20}
              autoFocus={item.autoFocus}
              sx={{
                ml: 1,
                color: item.role === "user" ? "#000044" : "#000044",
                flex: 1,
              }}
              // placeholder={"输入或选择要操作的标签。" + currentName}
              onChange={(event: any) => {
                changeContent(item.id, event.target.value);
              }}
            />

            <IconButton
              color="error"
              size="small"
              // hidden={!item.mouseOver}
              onClick={() => {
                delMessage(item.id);
              }}
            >
              <HorizontalRuleOutlinedIcon />
            </IconButton>
          </Paper>
        ))}
      </Paper>

      <Paper
        sx={{ display: "flex", margin: "10px", padding: "5px" }}
        elevation={4}
      >
        <Button variant="text" size="small" href="/">
          <ArrowBackIcon />
        </Button>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Button onClick={gptAnwser} disabled={gptAnswerLoading}>
          {gptAnswerLoading ? (
            <ScheduleSendOutlinedIcon />
          ) : (
            <SendOutlinedIcon />
          )}
        </Button>
        <Button onClick={addMessage}>
          <AddIcon />
        </Button>
        <Button color="error" onClick={newCompletions}>
          <ClearOutlinedIcon />
        </Button>
        <Button color="secondary" onClick={switchPlatform}>
          {platforms[platformIdx].name}
        </Button>
      </Paper>
    </Box>
  );
}
