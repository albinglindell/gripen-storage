import React from "react";
import { Card, Avatar, Tag, Badge, Button, Typography } from "antd";
import { InboxOutlined, EyeOutlined } from "@ant-design/icons";
import { CardboardBox } from "../types/storage";

const { Text } = Typography;

interface BoxCardProps {
  box: CardboardBox;
  roomName?: string;
  onBoxClick: (box: CardboardBox) => void;
  getItemCount: (box: CardboardBox) => number;
  getCategoryCount: (box: CardboardBox) => number;
}

const BoxCard: React.FC<BoxCardProps> = ({
  box,
  roomName,
  onBoxClick,
  getItemCount,
  getCategoryCount,
}) => {
  const onCardClickHandler = () => {
    onBoxClick(box);
  };

  const onViewContentsClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBoxClick(box);
  };

  return (
    <Card
      hoverable
      onClick={onCardClickHandler}
      style={{ cursor: "pointer", width: "100%" }}
      bodyStyle={{ padding: "16px" }}
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          onClick={onViewContentsClickHandler}
        >
          View Contents
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Avatar
          icon={<InboxOutlined />}
          style={{
            backgroundColor: "#1890ff",
            marginRight: "12px",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ fontSize: "18px" }}>
            Box {box.boxNumber}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {box.description}
          </Text>
          {roomName && (
            <>
              <br />
              <Tag color="purple" style={{ marginTop: "4px" }}>
                {roomName}
              </Tag>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <Tag color="blue">{getItemCount(box)} items</Tag>
        <Tag color="green">{getCategoryCount(box)} categories</Tag>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Created: {box.createdAt.toLocaleDateString()}
        </Text>
        <Badge status="processing" text="Active" />
      </div>
    </Card>
  );
};

export default BoxCard;
