import React from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Space,
  Statistic,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  BellOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const onLogoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Users",
    },
    {
      key: "reports",
      icon: <FileTextOutlined />,
      label: "Reports",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#001529",
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
            Admin Panel
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Dashboard
          </Title>

          <Space size="middle">
            <Button
              type="text"
              icon={<BellOutlined />}
              size="large"
              aria-label="Notifications"
              tabIndex={0}
            />
            <Space>
              <Avatar icon={<UserOutlined />} />
              <div>
                <Text strong>{currentUser?.email}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {currentUser?.displayName || "User"}
                </Text>
              </div>
            </Space>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogoutHandler}
              aria-label="Logout"
              tabIndex={0}
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#f0f2f5" }}
        >
          <div style={{ padding: 24, background: "#fff", borderRadius: "8px" }}>
            <Title level={3} style={{ marginBottom: "24px" }}>
              Welcome back, {currentUser?.displayName || currentUser?.email}!
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={1128}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Active Sessions"
                    value={93}
                    prefix={<DashboardOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Reports"
                    value={56}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Analytics"
                    value={112}
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: "#eb2f96" }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
              <Col xs={24} lg={12}>
                <Card title="Recent Activity" style={{ height: "300px" }}>
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text type="secondary">No recent activity to display</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Quick Actions" style={{ height: "300px" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button type="primary" block>
                      Create New User
                    </Button>
                    <Button block>Generate Report</Button>
                    <Button block>View Analytics</Button>
                    <Button block>System Settings</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
