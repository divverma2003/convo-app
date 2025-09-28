import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { useStreamChat } from "../hooks/useStreamChat";
const HomePage = () => {
  const { chatClient, error, isLoading } = useStreamChat();
  return (
    <div>
      <UserButton />
      Home Page
    </div>
  );
};

export default HomePage;
