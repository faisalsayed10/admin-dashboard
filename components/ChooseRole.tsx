import { Button, Card, Container, Text, Title } from "@mantine/core";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const ChooseRole = (props: Props) => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const updateRole = async (role: "admin" | "user") => {
    try {
      if (!user) return;
      await supabase.from("users").update({ role }).eq("id", user.id);
      router.reload();
    } catch (error) {
      alert("Error updating role!");
      console.log(error);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Title order={1}>Choose Your Role</Title>
      <Card sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button onClick={() => updateRole("admin")} variant="outline">
          Admin
        </Button>
        <Button onClick={() => updateRole("user")} variant="outline">
          User
        </Button>
      </Card>
    </Container>
  );
};

export default ChooseRole;
