import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Typography,
  List,
  Breadcrumb,
  Select,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Tag,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CardboardBox, StorageItem } from "../types/storage";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";
import BoxCard from "./BoxCard";
import BoxModal from "./BoxModal";
import ImageModal from "./ImageModal";
import { getItemCount, getCategoryCount, filterBoxes } from "../utils/boxUtils";
import {
  getUserRooms,
  addBox,
  getBoxesForRoom,
  deleteBox,
} from "../services/firebaseService";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const RoomDetail: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBox, setSelectedBox] = useState<CardboardBox | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState("rooms");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [boxes, setBoxes] = useState<CardboardBox[]>([]);
  const [addBoxModalVisible, setAddBoxModalVisible] = useState(false);
  const [addBoxLoading, setAddBoxLoading] = useState(false);
  const [boxImageFile, setBoxImageFile] = useState<File | null>(null);
  const [boxItems, setBoxItems] = useState<StorageItem[]>([]);
  const [roomName, setRoomName] = useState<string>("Room");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  const [form] = Form.useForm();

  // Create roomNames mapping for search
  const roomNames = rooms.reduce((acc, room) => {
    acc[room.id] = room.name;
    return acc;
  }, {} as { [key: string]: string });

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

  const onSearchHandler = (value: string) => {
    setSearchTerm(value);
  };

  const onBoxClickHandler = (box: CardboardBox) => {
    setSelectedBox(box);
    setIsModalVisible(true);
  };

  const onModalCloseHandler = () => {
    setIsModalVisible(false);
    setSelectedBox(null);
  };

  const onImageModalOpenHandler = () => {
    setIsImageModalVisible(true);
  };

  const onImageModalCloseHandler = () => {
    setIsImageModalVisible(false);
  };

  const onEditBoxHandler = () => {
    onModalCloseHandler();
    navigate(`/dashboard/box/${selectedBox?.id}/edit`);
  };

  const filteredBoxes = filterBoxes(
    boxes.filter((box) => box.roomId === roomId),
    searchTerm,
    "all",
    roomNames
  );

  // Add Box Modal Handlers
  const onAddBoxHandler = () => {
    setAddBoxModalVisible(true);
    setBoxImageFile(null);
    setBoxItems([]);
    form.resetFields();
  };

  const onAddBoxCancelHandler = () => {
    setAddBoxModalVisible(false);
    setBoxImageFile(null);
    setBoxItems([]);
    form.resetFields();
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

  // After adding a box, refresh boxes
  const onAddBoxFinish = async (values: any) => {
    if (!currentUser || !roomId) return;
    setAddBoxLoading(true);
    let imageUrl = "";
    try {
      if (boxImageFile) {
        const storageRef = ref(
          storage,
          `box-images/${currentUser.uid}/${Date.now()}_${boxImageFile.name}`
        );
        await uploadBytes(storageRef, boxImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addBox(currentUser.uid, roomId, {
        boxNumber: values.boxNumber,
        description: values.description,
        items: boxItems,
        imageUrl,
      });
      message.success("Box added successfully!");
      setAddBoxModalVisible(false);
      setBoxImageFile(null);
      setBoxItems([]);
      form.resetFields();
      // Refresh boxes list here
      const data = await getBoxesForRoom(currentUser.uid, roomId);
      setBoxes(data);
    } catch (error) {
      message.error("Failed to add box. Please try again.");
    } finally {
      setAddBoxLoading(false);
    }
  };

  // Fetch boxes for this room
  useEffect(() => {
    const fetchBoxes = async () => {
      if (!currentUser || !roomId) return;
      try {
        const data = await getBoxesForRoom(currentUser.uid, roomId);
        setBoxes(data);
      } catch (error) {
        setBoxes([]);
      }
    };
    fetchBoxes();
  }, [currentUser, roomId]);

  // Fetch room name
  useEffect(() => {
    const fetchRoomName = async () => {
      if (!currentUser || !roomId) return;
      const rooms = await getUserRooms(currentUser.uid);
      const room = rooms.find((r) => r.id === roomId);
      setRoomName(room?.name || "Room");
    };
    fetchRoomName();
  }, [currentUser, roomId]);

  // Fetch all rooms for search functionality
  useEffect(() => {
    const fetchAllRooms = async () => {
      if (!currentUser) return;
      try {
        const userRooms = await getUserRooms(currentUser.uid);
        setRooms(userRooms.map((r) => ({ id: r.id, name: r.name })));
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchAllRooms();
  }, [currentUser]);

  const onDeleteBoxHandler = (box: CardboardBox) => {
    Modal.confirm({
      title: "Delete Box",
      content: "Are you sure you want to delete this box?",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteBox(box.id);
          message.success("Box deleted");
          if (currentUser && roomId) {
            const data = await getBoxesForRoom(currentUser.uid, roomId);
            setBoxes(data);
          }
        } catch {
          message.error("Failed to delete box");
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavigationMenu
        selectedKey={selectedMenuKey}
        onLogout={onLogoutHandler}
      />

      <Layout>
        <HeaderComponent
          title={`${roomName} - Boxes`}
          currentUser={currentUser}
          showBackButton
          onBackClick={onBackToDashboardHandler}
          searchPlaceholder="Search boxes..."
          onSearch={onSearchHandler}
          boxes={boxes}
          roomNames={roomNames}
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
              ]}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                {roomName} - Cardboard Boxes
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddBoxHandler}
                style={{ marginBottom: 24 }}
              >
                Add Box
              </Button>
            </div>

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={filteredBoxes}
              renderItem={(box) => (
                <List.Item>
                  <BoxCard
                    box={box}
                    onBoxClick={onBoxClickHandler}
                    getItemCount={getItemCount}
                    getCategoryCount={getCategoryCount}
                    onDeleteBox={onDeleteBoxHandler}
                  />
                </List.Item>
              )}
            />

            <BoxModal
              box={selectedBox}
              isVisible={isModalVisible}
              onClose={onModalCloseHandler}
              onOpenImage={onImageModalOpenHandler}
              onEdit={onEditBoxHandler}
              getItemCount={getItemCount}
              getCategoryCount={getCategoryCount}
            />

            <ImageModal
              box={selectedBox}
              isVisible={isImageModalVisible}
              onClose={onImageModalCloseHandler}
            />
          </div>
        </Content>
      </Layout>
      <Modal
        title="Add Box"
        open={addBoxModalVisible}
        onCancel={onAddBoxCancelHandler}
        footer={null}
        destroyOnClose
        className="modal-responsive"
        centered
      >
        <Form form={form} layout="vertical" onFinish={onAddBoxFinish}>
          <Form.Item
            label="Box Number"
            name="boxNumber"
            rules={[{ required: true, message: "Please enter a box number" }]}
          >
            <Input placeholder="Box number" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Description (optional)" />
          </Form.Item>
          <Form.Item label="Items (optional)">
            <Button
              type="dashed"
              onClick={onAddItemHandler}
              style={{ marginBottom: 8 }}
            >
              Add Item
            </Button>
            <List
              dataSource={boxItems}
              renderItem={(item, idx) => (
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
                        onItemChangeHandler(item.id, "category", e.target.value)
                      }
                      style={{ width: 100 }}
                    />
                  </Space>
                </List.Item>
              )}
            />
          </Form.Item>
          <Form.Item label="Image (optional)">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={onBoxImageChange}
              onRemove={() => setBoxImageFile(null)}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addBoxLoading}
              style={{ width: "100%" }}
            >
              Add Box
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default RoomDetail;
