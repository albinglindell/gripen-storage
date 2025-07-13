import React, { useState, useMemo } from "react";
import {
  Layout,
  Button,
  Typography,
  Space,
  Avatar,
  AutoComplete,
  Input,
  Flex,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { User } from "../types/auth";
import { CardboardBox } from "../types/storage";

const { Header } = Layout;
const { Title, Text } = Typography;

interface HeaderComponentProps {
  title: string;
  currentUser: User | null;
  showBackButton?: boolean;
  onBackClick?: () => void;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  extraContent?: React.ReactNode;
  boxes?: CardboardBox[];
  roomNames?: { [key: string]: string };
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  currentUser,
  showBackButton = false,
  onBackClick,
  searchPlaceholder,
  onSearch,
  extraContent,
  boxes = [],
  roomNames = {},
}) => {
  const [searchValue, setSearchValue] = useState("");

  const searchOptions = useMemo(() => {
    if (!searchValue.trim()) return [];

    const options: { value: string; label: string; type: string }[] = [];
    const searchLower = searchValue.toLowerCase();

    // Add box numbers and descriptions
    boxes.forEach((box) => {
      if (box.boxNumber.toLowerCase().startsWith(searchLower)) {
        options.push({
          value: box.boxNumber,
          label: `Box ${box.boxNumber}`,
          type: "box",
        });
      }
      if (box.description.toLowerCase().includes(searchLower)) {
        options.push({
          value: box.description,
          label: box.description,
          type: "description",
        });
      }
    });

    // Add room names
    Object.entries(roomNames).forEach(([roomId, roomName]) => {
      if (roomName.toLowerCase().includes(searchLower)) {
        options.push({
          value: roomName,
          label: roomName,
          type: "room",
        });
      }
    });

    // Add items and categories
    boxes.forEach((box) => {
      box.items.forEach((item) => {
        if (item.name.toLowerCase().startsWith(searchLower)) {
          options.push({
            value: item.name,
            label: `${item.name} (${roomNames[box.roomId] || "Unknown Room"})`,
            type: "item",
          });
        }
        if (
          item.category &&
          item.category.toLowerCase().startsWith(searchLower)
        ) {
          options.push({
            value: item.category,
            label: `${item.category} (${
              roomNames[box.roomId] || "Unknown Room"
            })`,
            type: "category",
          });
        }
      });
    });

    // Remove duplicates and limit results
    const uniqueOptions = options.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );

    return uniqueOptions.slice(0, 10);
  }, [searchValue, boxes, roomNames]);

  const onSearchHandler = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const onSelectHandler = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const searchBar =
    searchPlaceholder && onSearch ? (
      <AutoComplete
        value={searchValue}
        options={searchOptions}
        onSearch={onSearchHandler}
        onSelect={onSelectHandler}
        style={{ width: 250 }}
        className="search-responsive"
        notFoundContent="No matches found"
      >
        <Input
          style={{ fontSize: "16px" }}
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder}
        />
      </AutoComplete>
    ) : null;

  return (
    <>
      <Header
        className="header-responsive"
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          height: 72,
          padding: "0 40px 0 24px",
        }}
      >
        <Flex align="center">
          {showBackButton && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBackClick}
              style={{ marginRight: "16px" }}
            >
              Back
            </Button>
          )}
          <Title level={4} style={{ margin: 0 }} className="title-responsive">
            {title}
          </Title>
        </Flex>

        <Flex align="center" className="space-responsive" gap={16}>
          <div className="hidden-xs">{searchBar}</div>
          <Space align="center" className="hidden-xs">
            <Avatar icon={<UserOutlined />} />
            <Flex vertical>
              <Text strong>{currentUser?.email}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {currentUser?.displayName || "User"}
              </Text>
            </Flex>
          </Space>
        </Flex>
      </Header>
      <Flex className="mobile-search-container">{searchBar}</Flex>
    </>
  );
};

export default HeaderComponent;
