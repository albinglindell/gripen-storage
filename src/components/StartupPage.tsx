import React, { useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  List,
  Flex,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createUserProfile, addRoom } from "../services/firebaseService";

const { Content } = Layout;
const { Title, Text } = Typography;

const StartupPage: React.FC = () => {
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<string[]>([""]);

  const onAddRoomHandler = () => {
    setRooms([...rooms, ""]);
  };

  const onRemoveRoomHandler = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const onRoomChangeHandler = (index: number, value: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = value;
    setRooms(updatedRooms);
  };

  const onFinishHandler = async (values: { address: string }) => {
    if (!currentUser) {
      message.error("User not authenticated");
      return;
    }

    // Validate rooms
    const validRooms = rooms.filter((room) => room.trim() !== "");
    if (validRooms.length === 0) {
      message.error("Please add at least one room");
      return;
    }

    setLoading(true);
    try {
      // Only store address in user profile, not rooms
      await createUserProfile(
        currentUser.uid,
        currentUser.email,
        currentUser.displayName,
        values.address,
        []
      );

      // Add each room as a document in the rooms collection
      await Promise.all(
        validRooms.map((roomName) =>
          addRoom(currentUser.uid, { name: roomName, boxCount: 0 })
        )
      );

      // Refresh the user profile to trigger navigation
      await refreshProfile(currentUser.uid);

      message.success("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      message.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ padding: "24px" }}>
        <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
          <Card
            style={{ width: "100%", maxWidth: 600 }}
            title={
              <Flex align="center" gap={8}>
                <HomeOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  Welcome to Gripen Storage!
                </Title>
              </Flex>
            }
          >
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: "24px" }}
            >
              Let's set up your storage space. Please provide your address and
              add the rooms where you'll store your boxes.
            </Text>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinishHandler}
              initialValues={{ address: "" }}
            >
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                  { min: 5, message: "Address must be at least 5 characters" },
                ]}
              >
                <Input type="Text" placeholder="Enter your address" />
              </Form.Item>

              <Divider orientation="left">Rooms</Divider>

              <List
                dataSource={rooms}
                renderItem={(room, index) => (
                  <List.Item
                    style={{
                      padding: "16px",
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      background: "#fafafa",
                    }}
                  >
                    <Flex
                      vertical
                      style={{ width: "100%", padding: 16 }}
                      gap={12}
                    >
                      <Flex gap={12} align="center" justify="space-between">
                        <Text strong>Room {index + 1}</Text>
                        {rooms.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveRoomHandler(index)}
                            size="small"
                          />
                        )}
                      </Flex>

                      <Input
                        placeholder="Room name"
                        value={room}
                        onChange={(e) =>
                          onRoomChangeHandler(index, e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </Flex>
                  </List.Item>
                )}
              />

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={onAddRoomHandler}
                style={{ width: "100%", marginBottom: "24px" }}
              >
                Add Another Room
              </Button>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  style={{ width: "100%" }}
                >
                  Complete Setup
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default StartupPage;
