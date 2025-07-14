import React from "react";
import { Card, Avatar, Tag, Badge, Button, Typography, Flex } from "antd";
import { InboxOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { CardboardBox } from "../types/storage";

const { Text } = Typography;

interface BoxCardProps {
  box: CardboardBox;
  roomName?: string;
  onBoxClick: (box: CardboardBox) => void;
  getItemCount: (box: CardboardBox) => number;
  getCategoryCount: (box: CardboardBox) => number;
  onDeleteBox?: (box: CardboardBox) => void;
}

function toDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === "object" && val.seconds)
    return new Date(val.seconds * 1000);
  return new Date(val);
}

const BoxCard: React.FC<BoxCardProps> = ({
  box,
  roomName,
  onBoxClick,
  getItemCount,
  getCategoryCount,
  onDeleteBox,
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
      ].filter(Boolean)}
    >
      <Flex
        vertical
        style={{
          marginBottom: "12px",
        }}
      >
        <Flex flex={1}>
          <Avatar
            icon={<InboxOutlined />}
            style={{
              backgroundColor: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Flex justify="space-between" flex={1}>
            <Text strong style={{ fontSize: "18px" }}>
              Box {box.boxNumber}
            </Text>
            {onDeleteBox && (
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBox(box);
                }}
              />
            )}
          </Flex>
        </Flex>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          {box.description}
        </Text>
        {roomName && (
          <>
            <Tag color="purple" style={{ marginTop: "4px" }}>
              {roomName}
            </Tag>
          </>
        )}
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        style={{
          marginBottom: "8px",
        }}
      >
        <Tag color="blue">{getItemCount(box)} items</Tag>
        <Tag color="green">{getCategoryCount(box)} categories</Tag>
      </Flex>
    </Card>
  );
};

export default BoxCard;
