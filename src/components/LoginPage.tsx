import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { getAuthErrorMessage } from "../utils/authTest";
import { AuthError } from "firebase/auth";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinishHandler = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setError("");
      setLoading(true);

      if (isSignup) {
        await signup(values.email, values.password);
      } else {
        await login(values.email, values.password);
      }

      navigate("/dashboard");
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error("Authentication error:", authError);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInHandler = async () => {
    try {
      setError("");
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error("Google authentication error:", authError);
    } finally {
      setGoogleLoading(false);
    }
  };

  const onToggleModeHandler = () => {
    setIsSignup(() => !isSignup);
    setError("");
    form.resetFields();
  };

  const onKeyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      form.submit();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ marginBottom: "8px", color: "#1890ff" }}>
            {isSignup ? "Create Account" : "Welcome Back"}
          </Title>
          <Text type="secondary">
            {isSignup ? "Sign up to get started" : "Sign in to your account"}
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "24px" }}
            description={
              error.includes("not enabled") && (
                <div style={{ marginTop: "8px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Please enable Email/Password authentication in your Firebase
                    Console:
                    <br />
                    Authentication → Sign-in method → Email/Password → Enable
                  </Text>
                </div>
              )
            }
          />
        )}

        <Button
          type="default"
          size="large"
          icon={<GoogleOutlined />}
          onClick={onGoogleSignInHandler}
          loading={googleLoading}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "24px",
            border: "1px solid #d9d9d9",
            background: "#fff",
            color: "#333",
          }}
          aria-label="Sign in with Google"
          tabIndex={0}
        >
          Continue with Google
        </Button>
        {/* 
        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <Form
          form={form}
          name="login"
          onFinish={onFinishHandler}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email address"
              onKeyDown={onKeyDownHandler}
              aria-label="Email address"
              tabIndex={0}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              onKeyDown={onKeyDownHandler}
              aria-label="Password"
              tabIndex={0}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
              }}
              aria-label={isSignup ? "Create account" : "Sign in"}
              tabIndex={0}
            >
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <div style={{ textAlign: "center" }}>
          <Button
            type="link"
            onClick={onToggleModeHandler}
            style={{ fontSize: "14px" }}
            aria-label={isSignup ? "Switch to sign in" : "Switch to sign up"}
            tabIndex={0}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </div> */}
      </Card>
    </div>
  );
};

export default LoginPage;
