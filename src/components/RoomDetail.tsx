import React, { useState } from "react";
import { Layout, Button, Typography, List, Breadcrumb, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CardboardBox } from "../types/storage";
import NavigationMenu from "./NavigationMenu";
import HeaderComponent from "./HeaderComponent";
import BoxCard from "./BoxCard";
import BoxModal from "./BoxModal";
import ImageModal from "./ImageModal";
import { getItemCount, getCategoryCount, filterBoxes } from "../utils/boxUtils";
import { MOCK_ROOM_NAMES, MOCK_BOXES } from "../constants/mockData";

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
    MOCK_BOXES.filter((box) => box.roomId === roomId),
    searchTerm
  );

  const roomName = MOCK_ROOM_NAMES[roomId || ""] || "Room";

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
          boxes={MOCK_BOXES.filter((box) => box.roomId === roomId)}
          roomNames={MOCK_ROOM_NAMES}
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
                onClick={() => navigate(`/dashboard/room/${roomId}/add-box`)}
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
    </Layout>
  );
};

export default RoomDetail;
