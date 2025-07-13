import React, { useState, useEffect } from "react";
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
  message,
  Spin,
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
import { Room } from "../types/auth";
import { getUserRooms } from "../services/firebaseService";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";

const { Content } = Layout;
const { Title, Text } = Typography;

const StorageDashboard: React.FC = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedMenuKey, setSelectedMenuKey] = useState("dashboard");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userRooms = await getUserRooms(currentUser.uid);
        setRooms(userRooms);
      } catch (error) {
        message.error("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentUser]);

  const totalBoxes = rooms.reduce((sum, room) => sum + room.boxCount, 0);

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

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <NavigationMenu
          selectedKey={selectedMenuKey}
          onLogout={onLogoutHandler}
        />
        <Layout>
          <HeaderComponent title="Dashboard" currentUser={currentUser} />
          <Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f0f2f5",
              minHeight: "calc(100vh - 72px)",
            }}
          >
            <Spin size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

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

            {userProfile && (
              <div style={{ marginBottom: "24px" }}>
                <Text type="secondary">
                  <strong>Address:</strong> {userProfile.address}
                </Text>
              </div>
            )}

            <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Rooms"
                    value={rooms.length}
                    prefix={<FolderOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Boxes"
                    value={totalBoxes}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>

            <Title level={4} style={{ marginBottom: "16px" }}>
              Rooms
            </Title>

            {rooms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Text type="secondary">
                  No rooms found. Add your first room to get started!
                </Text>
                <br />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/dashboard/add-room")}
                  style={{ marginTop: "16px" }}
                >
                  Add Your First Room
                </Button>
              </div>
            ) : (
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                dataSource={rooms}
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
                          {room.description && (
                            <>
                              <br />
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {room.description}
                              </Text>
                            </>
                          )}
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
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StorageDashboard;
