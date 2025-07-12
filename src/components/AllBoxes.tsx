import React, { useState } from "react";
import {
  Layout,
  Button,
  Typography,
  List,
  Breadcrumb,
  Select,
  Flex,
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
import { MOCK_ROOM_NAMES, MOCK_BOXES } from "../constants/mockData";

const { Content } = Layout;
const { Title } = Typography;
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
    MOCK_BOXES,
    searchTerm,
    roomFilter,
    MOCK_ROOM_NAMES
  );

  const roomFilterOptions = (
    <Select
      defaultValue="all"
      style={{ width: 150 }}
      onChange={setRoomFilter}
      className="hidden-xs"
    >
      <Option value="all">All Rooms</Option>
      <Option value="1">Living Room</Option>
      <Option value="2">Bedroom</Option>
      <Option value="3">Kitchen</Option>
      <Option value="4">Basement</Option>
      <Option value="5">Attic</Option>
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
          showBackButton
          onBackClick={onBackToDashboardHandler}
          searchPlaceholder="Search boxes..."
          onSearch={onSearchHandler}
          extraContent={roomFilterOptions}
          boxes={MOCK_BOXES}
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
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Breadcrumb.Item>
                <Button type="link" onClick={onBackToDashboardHandler}>
                  Dashboard
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Item>All Boxes</Breadcrumb.Item>
            </Breadcrumb>

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
                <Option value="1">Living Room</Option>
                <Option value="2">Bedroom</Option>
                <Option value="3">Kitchen</Option>
                <Option value="4">Basement</Option>
                <Option value="5">Attic</Option>
              </Select>
            </div>

            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={filteredBoxes}
              renderItem={(box) => (
                <List.Item>
                  <Flex justify="center">
                    <BoxCard
                      box={box}
                      roomName={MOCK_ROOM_NAMES[box.roomId]}
                      onBoxClick={onBoxClickHandler}
                      getItemCount={getItemCount}
                      getCategoryCount={getCategoryCount}
                    />
                  </Flex>
                </List.Item>
              )}
            />

            <BoxModal
              box={selectedBox}
              isVisible={isModalVisible}
              roomName={
                selectedBox ? MOCK_ROOM_NAMES[selectedBox.roomId] : undefined
              }
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
