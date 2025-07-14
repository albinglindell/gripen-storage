import React from "react";
import { Layout, Menu, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

interface NavigationMenuProps {
  selectedKey: string;
  onLogout: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  selectedKey,
  onLogout,
}) => {
  const navigate = useNavigate();

  const onMenuClickHandler = ({ key }: { key: string }) => {
    switch (key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "boxes":
        navigate("/dashboard/all-boxes");
        break;
      case "logout":
        onLogout();
        break;
      default:
        break;
    }
  };

  const mainMenuItems = [
    {
      key: "dashboard",
      icon: <span>📊</span>,
      label: "Dashboard",
    },
    {
      key: "boxes",
      icon: <span>📦</span>,
      label: "All Boxes",
    },
  ];

  const logoutMenuItem = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        background: "#001529",
        position: "relative",
        height: "100svh",
      }}
    >
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #303030",
        }}
      >
        <Title level={4} style={{ color: "white", margin: 0 }}>
          Storage Manager
        </Title>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={mainMenuItems}
        onClick={onMenuClickHandler}
        style={{
          borderRight: 0,
          height: "calc(100svh - 64px - 50px)",
          overflowY: "auto",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          borderTop: "1px solid #303030",
          background: "#001529",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={logoutMenuItem}
          onClick={onMenuClickHandler}
          style={{
            borderRight: 0,
          }}
        />
      </div>
    </Sider>
  );
};

export default NavigationMenu;
