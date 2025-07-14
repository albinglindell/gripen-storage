import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Typography,
  Form,
  Input,
  Upload,
  message,
  Space,
  List,
  Spin,
  Breadcrumb,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CardboardBox, StorageItem } from "../types/storage";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";
import {
  getBoxById,
  updateBox,
  getUserRooms,
} from "../services/firebaseService";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const { Content } = Layout;
const { Title } = Typography;

const EditBox: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { boxId } = useParams<{ boxId: string }>();
  const [box, setBox] = useState<CardboardBox | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [boxImageFile, setBoxImageFile] = useState<File | null>(null);
  const [boxItems, setBoxItems] = useState<StorageItem[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [selectedMenuKey, setSelectedMenuKey] = useState("boxes");

  const [form] = Form.useForm();

  const onLogoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const onBackToDashboardHandler = () => {
    navigate("/dashboard");
  };

  const onBoxImageChange = (info: any) => {
    if (info.file.status === "removed") {
      setBoxImageFile(null);
    } else if (info.file.originFileObj) {
      setBoxImageFile(info.file.originFileObj);
    }
  };

  const onAddItemHandler = () => {
    setBoxItems([...boxItems, { id: `${Date.now()}`, name: "", quantity: 1 }]);
  };

  const onRemoveItemHandler = (id: string) => {
    setBoxItems(boxItems.filter((item) => item.id !== id));
  };

  const onItemChangeHandler = (
    id: string,
    field: keyof StorageItem,
    value: any
  ) => {
    setBoxItems(
      boxItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const onSaveHandler = async (values: any) => {
    if (!currentUser || !boxId) return;
    setSaving(true);
    let imageUrl = box?.imageUrl || "";

    try {
      if (boxImageFile) {
        const storageRef = ref(
          storage,
          `box-images/${currentUser.uid}/${Date.now()}_${boxImageFile.name}`
        );
        await uploadBytes(storageRef, boxImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateBox(boxId, {
        boxNumber: values.boxNumber,
        description: values.description,
        items: boxItems,
        imageUrl,
      });

      message.success("Box updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      message.error("Failed to update box. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchBox = async () => {
      if (!currentUser || !boxId) return;
      try {
        setLoading(true);
        const boxData = await getBoxById(boxId);
        if (boxData) {
          setBox(boxData);
          setBoxItems(boxData.items);
          form.setFieldsValue({
            boxNumber: boxData.boxNumber,
            description: boxData.description,
          });

          const rooms = await getUserRooms(currentUser.uid);
          const room = rooms.find((r) => r.id === boxData.roomId);
          setRoomName(room?.name || "Unknown Room");
        } else {
          message.error("Box not found");
          navigate("/dashboard");
        }
      } catch (error) {
        message.error("Failed to load box");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchBox();
  }, [currentUser, boxId, form, navigate]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <NavigationMenu
          selectedKey={selectedMenuKey}
          onLogout={onLogoutHandler}
        />
        <Layout>
          <HeaderComponent title="Edit Box" currentUser={currentUser} />
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

  if (!box) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavigationMenu
        selectedKey={selectedMenuKey}
        onLogout={onLogoutHandler}
      />
      <Layout>
        <HeaderComponent
          title={`Edit Box ${box.boxNumber}`}
          currentUser={currentUser}
          showBackButton
          onBackClick={onBackToDashboardHandler}
        />

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
            <Breadcrumb
              style={{ marginBottom: "24px" }}
              items={[
                {
                  title: (
                    <Button type="link" onClick={onBackToDashboardHandler}>
                      Dashboard
                    </Button>
                  ),
                },
                {
                  title: roomName,
                },
                {
                  title: `Box ${box.boxNumber}`,
                },
              ]}
            />

            <Title level={3} style={{ marginBottom: "24px" }}>
              Edit Box {box.boxNumber}
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={onSaveHandler}
              style={{ maxWidth: "600px" }}
            >
              <Form.Item
                label="Box Number"
                name="boxNumber"
                rules={[
                  { required: true, message: "Please enter a box number" },
                ]}
              >
                <Input placeholder="Box number" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea placeholder="Description (optional)" />
              </Form.Item>

              <Form.Item label="Items">
                <Button
                  type="dashed"
                  onClick={onAddItemHandler}
                  style={{ marginBottom: 8 }}
                >
                  Add Item
                </Button>
                <List
                  dataSource={boxItems}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Button
                          type="link"
                          danger
                          onClick={() => onRemoveItemHandler(item.id)}
                          size="small"
                        >
                          Remove
                        </Button>,
                      ]}
                    >
                      <Space>
                        <Input
                          placeholder="Name"
                          value={item.name}
                          onChange={(e) =>
                            onItemChangeHandler(item.id, "name", e.target.value)
                          }
                          style={{ width: 120 }}
                        />
                        <Input
                          type="number"
                          min={1}
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            onItemChangeHandler(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          style={{ width: 60 }}
                        />
                        <Input
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) =>
                            onItemChangeHandler(
                              item.id,
                              "category",
                              e.target.value
                            )
                          }
                          style={{ width: 100 }}
                        />
                      </Space>
                    </List.Item>
                  )}
                />
              </Form.Item>

              <Form.Item label="Image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  onChange={onBoxImageChange}
                  onRemove={() => setBoxImageFile(null)}
                  accept="image/*"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload New Image</Button>
                </Upload>
                {box.imageUrl && !boxImageFile && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={box.imageUrl}
                      alt="Current box image"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Save Changes
                  </Button>
                  <Button onClick={onBackToDashboardHandler}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditBox;
