import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import StartupPage from "./components/StartupPage";
import StorageDashboard from "./components/StorageDashboard";
import RoomDetail from "./components/RoomDetail";
import AllBoxes from "./components/AllBoxes";
import EditBox from "./components/EditBox";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/startup"
              element={
                <PrivateRoute>
                  <StartupPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <StorageDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/room/:roomId"
              element={
                <PrivateRoute>
                  <RoomDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/all-boxes"
              element={
                <PrivateRoute>
                  <AllBoxes />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/box/:boxId/edit"
              element={
                <PrivateRoute>
                  <EditBox />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
