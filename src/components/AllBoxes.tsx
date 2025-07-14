import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Typography,
  List,
  Breadcrumb,
  Select,
  Flex,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CardboardBox } from "../types/storage";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";
import BoxCard from "./BoxCard";
import BoxModal from "./BoxModal";
import ImageModal from "./ImageModal";
import { getItemCount, getCategoryCount, filterBoxes } from "../utils/boxUtils";
import { getUserRooms, getAllBoxesForUser } from "../services/firebaseService";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AllBoxes: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBox, setSelectedBox] = useState<CardboardBox | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState("boxes");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [boxes, setBoxes] = useState<CardboardBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  // Create roomNames mapping for search
  const roomNames = rooms.reduce((acc, room) => {
    acc[room.id] = room.name;
    return acc;
  }, {} as { [key: string]: string });

  useEffect(() => {
    const fetchRoomsAndBoxes = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const userRooms = await getUserRooms(currentUser.uid);
        setRooms(userRooms.map((r) => ({ id: r.id, name: r.name })));
        const userBoxes = await getAllBoxesForUser(currentUser.uid);
        setBoxes(userBoxes);
      } catch (error) {
        console.error("Error fetching boxes or rooms:", error);
        message.error("Failed to load boxes or rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsAndBoxes();
  }, [currentUser]);

  // Filter boxes by selected room and search term
  const filteredBoxes = filterBoxes(boxes, searchTerm, roomFilter, roomNames);

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

  const roomFilterOptions = (
    <Select
      defaultValue="all"
      style={{ width: 150 }}
      onChange={setRoomFilter}
      className="hidden-xs"
    >
      <Option value="all">All Rooms</Option>
      {rooms.map((room) => (
        <Option key={room.id} value={room.id}>
          {room.name}
        </Option>
      ))}
    </Select>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavigationMenu
        selectedKey={selectedMenuKey}
        onLogout={onLogoutHandler}
      />

      <Layout>
        <HeaderComponent
          title="All Boxes"
          currentUser={currentUser}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#fff",
          }}
          showBackButton
          onBackClick={onBackToDashboardHandler}
          searchPlaceholder="Search boxes..."
          onSearch={onSearchHandler}
          extraContent={roomFilterOptions}
          boxes={boxes}
          roomNames={roomNames}
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
            <Breadcrumb
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
              items={[
                {
                  title: (
                    <Button type="link" onClick={onBackToDashboardHandler}>
                      Dashboard
                    </Button>
                  ),
                },
                {
                  title: (
                    <Text
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      All Boxes
                    </Text>
                  ),
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
                All Cardboard Boxes ({filteredBoxes.length})
              </Title>
            </div>

            <div className="hidden-sm" style={{ marginBottom: "16px" }}>
              <Select
                defaultValue="all"
                style={{ width: "100%" }}
                onChange={setRoomFilter}
                placeholder="Filter by room"
              >
                <Option value="all">All Rooms</Option>
                {rooms.map((room) => (
                  <Option key={room.id} value={room.id}>
                    {room.name}
                  </Option>
                ))}
              </Select>
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
                  />
                </List.Item>
              )}
            />

            <BoxModal
              box={selectedBox}
              isVisible={isModalVisible}
              roomName={selectedBox ? roomNames[selectedBox.roomId] : undefined}
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
    </Layout>
  );
};

export default AllBoxes;
