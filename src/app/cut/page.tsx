"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Cut() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        flexDirection: "column",
        // padding: "15px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* 标题栏 */}
      <Box
        sx={{
          width: "100%",
          height: "40px",
          padding: "0 10px 0 10px",
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Button variant="text" size="small" sx={{ height: "24px" }} href="/">
            <ArrowBackIcon />
          </Button>

          <Typography
            variant="body2"
            component={"div"}
            sx={{ fontSize: "0.8rem", color: "#aaaaaa" }}
          >
            {"自动保存于00:00:23"}
          </Typography>
        </Box>

        <Typography gutterBottom variant="body2" component={"div"} sx={{}}>
          {"Yree"}
        </Typography>

        <Box>
          <Button variant="contained" size="small" sx={{ height: "24px" }}>
            {"导出"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "50%",
          flexGrow: 1,
          justifyContent: "center",
          padding: "0 10px 10px 10px",
        }}
      >
        {/* 素材库 */}
        <Paper
          variant="outlined"
          elevation={0}
          sx={{
            width: "32%",
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        ></Paper>

        {/* 效果展示区 */}
        <Paper
          variant="outlined"
          elevation={0}
          sx={{
            flex: 1,
            margin: "0 10px 0 10px",
            height: "100%",
          }}
        ></Paper>

        {/* 素材调整 */}
        <Paper
          variant="outlined"
          elevation={0}
          sx={{
            width: "32%",
            height: "100%",
          }}
        ></Paper>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          // flex: 1,
          height: "50%",
          padding: "0 10px 10px 10px",
        }}
      >
        {/* 轨道 */}
        <Paper
          variant="outlined"
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
          }}
        ></Paper>
      </Box>
    </Box>
  );
}
