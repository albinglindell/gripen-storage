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
  Modal,
  Form,
  Input,
} from "antd";
import {
  FolderOutlined,
  HomeOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Room } from "../types/auth";
import {
  getUserRooms,
  addRoom,
  getAllBoxesForUser,
  deleteRoom,
} from "../services/firebaseService";
import { CardboardBox } from "../types/storage";
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
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [addRoomLoading, setAddRoomLoading] = useState(false);
  const [form] = Form.useForm();
  const [boxes, setBoxes] = useState<CardboardBox[]>([]);

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

  const fetchRooms = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const userRooms = await getUserRooms(currentUser.uid);
      setRooms(userRooms);
    } catch (error) {
      message.error("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomsAndBoxes = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userRooms = await getUserRooms(currentUser.uid);
        setRooms(userRooms);
        const userBoxes = await getAllBoxesForUser(currentUser.uid);
        setBoxes(userBoxes);
      } catch (error) {
        message.error("Failed to load rooms or boxes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsAndBoxes();
  }, [currentUser]);

  const totalBoxes = boxes.length;

  // Add Room Modal Handlers
  const onAddRoomHandler = () => {
    setAddRoomModalVisible(true);
    form.resetFields();
  };

  const onAddRoomCancelHandler = () => {
    setAddRoomModalVisible(false);
    form.resetFields();
  };

  const onAddRoomFinish = async (values: { name: string }) => {
    if (!currentUser) return;
    setAddRoomLoading(true);
    try {
      await addRoom(currentUser.uid, { name: values.name, boxCount: 0 });
      message.success("Room added successfully!");
      setAddRoomModalVisible(false);
      form.resetFields();
      await fetchRooms();
    } catch (error) {
      message.error("Failed to add room. Please try again.");
    } finally {
      setAddRoomLoading(false);
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
        <HeaderComponent
          title="Dashboard"
          currentUser={currentUser}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#fff",
          }}
        />

        <Content
          className="content-responsive"
          style={{
            margin: "24px 16px 0 0",
            padding: 24,
            background: "#f0f2f5",
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
                onClick={onAddRoomHandler}
              >
                Add Room
              </Button>
            </div>

            {/* Add Room Modal */}
            <Modal
              title="Add Room"
              open={addRoomModalVisible}
              onCancel={onAddRoomCancelHandler}
              footer={null}
              destroyOnClose
            >
              <Form form={form} layout="vertical" onFinish={onAddRoomFinish}>
                <Form.Item
                  label="Room Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter a room name" },
                  ]}
                >
                  <Input placeholder="Room name" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={addRoomLoading}
                    style={{ width: "100%" }}
                  >
                    Add Room
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

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
                  onClick={onAddRoomHandler}
                  style={{ marginTop: "16px" }}
                >
                  Add Your First Room
                </Button>
              </div>
            ) : (
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                dataSource={rooms}
                renderItem={(room) => {
                  const boxCount = boxes.filter(
                    (box) => box.roomId === room.id
                  ).length;
                  return (
                    <List.Item>
                      <Card
                        hoverable
                        onClick={() => onRoomSelectHandler(room.id)}
                        style={{ cursor: "pointer" }}
                        bodyStyle={{ padding: "16px" }}
                        actions={[
                          <Button
                            danger
                            type="text"
                            disabled={boxCount > 0}
                            onClick={async (e) => {
                              e.stopPropagation();
                              Modal.confirm({
                                title: "Delete Room",
                                content:
                                  boxCount > 0
                                    ? "You must delete all boxes in this room first."
                                    : "Are you sure you want to delete this room?",
                                okText: "Delete",
                                cancelText: "Cancel",
                                okButtonProps: {
                                  danger: true,
                                  disabled: boxCount > 0,
                                },
                                onOk: async () => {
                                  try {
                                    await deleteRoom(room.id);
                                    message.success("Room deleted");
                                    await fetchRooms();
                                  } catch {
                                    message.error("Failed to delete room");
                                  }
                                },
                                onCancel: () => {},
                              });
                            }}
                          >
                            Delete
                          </Button>,
                        ]}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <Avatar
                            icon={<HomeOutlined />}
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
                          <Tag color="blue">{boxCount} boxes</Tag>
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
                  );
                }}
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StorageDashboard;
