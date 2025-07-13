import React from "react";
import { Spin, Flex } from "antd";

const LoadingSpinner: React.FC = () => {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Spin size="large" />
    </Flex>
  );
};

export default LoadingSpinner;
