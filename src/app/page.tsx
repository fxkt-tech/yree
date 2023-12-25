"use client";

import MainCard from "@/components/AppCard";
import { Box, Unstable_Grid2 as Grid } from "@mui/material";
import { CARD_CONTENTS } from "./const";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        padding: "15px",
        backgroundColor: "#ffffff",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {CARD_CONTENTS.map((c, i) => (
          <Grid xs={4} sm={2} md={2} key={i}>
            <MainCard title={c.title} desc={c.desc} path={c.path}></MainCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
