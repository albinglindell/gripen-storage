import React, { useState } from "react";
import {
  Layout,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  List,
  Tag,
  Statistic,
} from "antd";
import {
  FolderOutlined,
  InboxOutlined,
  PlusOutlined,
  HomeOutlined,
  CoffeeOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Room, StorageStats } from "../types/storage";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";

const { Content } = Layout;
const { Title, Text } = Typography;

const StorageDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedMenuKey, setSelectedMenuKey] = useState("dashboard");

  const onLogoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const onRoomSelectHandler = (roomId: string) => {
    setSelectedRoom(roomId);
    navigate(`/dashboard/room/${roomId}`);
  };

  const mockRooms: Room[] = [
    {
      id: "1",
      name: "Living Room",
      description: "Main living area",
      boxCount: 12,
    },
    {
      id: "2",
      name: "Bedroom",
      description: "Master bedroom",
      boxCount: 8,
    },
    {
      id: "3",
      name: "Kitchen",
      description: "Kitchen and dining area",
      boxCount: 5,
    },
    {
      id: "4",
      name: "Basement",
      description: "Storage basement",
      boxCount: 25,
    },
    {
      id: "5",
      name: "Attic",
      description: "Attic storage",
      boxCount: 15,
    },
  ];

  const mockStats: StorageStats = {
    totalRooms: 5,
    totalBoxes: 65,
  };

  const getRoomIcon = (roomName: string) => {
    switch (roomName.toLowerCase()) {
      case "living room":
        return <HomeOutlined />;
      case "bedroom":
        return <HomeOutlined />;
      case "kitchen":
        return <ShopOutlined />;
      case "basement":
        return <FolderOutlined />;
      case "attic":
        return <FolderOutlined />;
      default:
        return <CoffeeOutlined />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavigationMenu
        selectedKey={selectedMenuKey}
        onLogout={onLogoutHandler}
      />

      <Layout>
        <HeaderComponent title="Dashboard" currentUser={currentUser} />

        <Content
          className="content-responsive"
          style={{
            margin: "24px 16px 0 0",
            padding: 24,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 72px)",
          }}
        >
          <div
            style={{ padding: 24, background: "#fff", borderRadius: "8px" }}
            className="card-responsive"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                Welcome back, {currentUser?.displayName || currentUser?.email}!
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/dashboard/add-room")}
              >
                Add Room
              </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Rooms"
                    value={mockStats.totalRooms}
                    prefix={<FolderOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Boxes"
                    value={mockStats.totalBoxes}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>

            <Title level={4} style={{ marginBottom: "16px" }}>
              Rooms
            </Title>

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={mockRooms}
              renderItem={(room) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() => onRoomSelectHandler(room.id)}
                    style={{ cursor: "pointer" }}
                    bodyStyle={{ padding: "16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Avatar
                        icon={getRoomIcon(room.name)}
                        style={{
                          backgroundColor: "#1890ff",
                          marginRight: "12px",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: "16px" }}>
                          {room.name}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {room.description}
                        </Text>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Tag color="blue">{room.boxCount} boxes</Tag>
                      <Button
                        type="link"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRoomSelectHandler(room.id);
                        }}
                      >
                        View Boxes
                      </Button>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StorageDashboard;
