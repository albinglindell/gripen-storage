import React from "react";
import {
  Modal,
  Avatar,
  Typography,
  Button,
  Row,
  Col,
  Card,
  List,
  Tag,
  Flex,
} from "antd";
import { InboxOutlined, PictureOutlined } from "@ant-design/icons";
import { CardboardBox } from "../types/storage";

const { Text } = Typography;

interface BoxModalProps {
  box: CardboardBox | null;
  isVisible: boolean;
  roomName?: string;
  onClose: () => void;
  onOpenImage: () => void;
  onEdit: () => void;
  getItemCount: (box: CardboardBox) => number;
  getCategoryCount: (box: CardboardBox) => number;
}

const BoxModal: React.FC<BoxModalProps> = ({
  box,
  isVisible,
  roomName,
  onClose,
  onOpenImage,
  onEdit,
  getItemCount,
  getCategoryCount,
}) => {
  if (!box) return null;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            icon={<InboxOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 600 }}>
              Box {box.boxNumber}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              {box.description}
            </div>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Flex align="center" justify="center" gap={8}>
          <Button key="close" onClick={onClose}>
            Close
          </Button>
          <Button key="edit" onClick={onEdit}>
            Edit Box
          </Button>
          <Button
            key="openBox"
            type="primary"
            icon={<PictureOutlined />}
            onClick={onOpenImage}
            disabled={!box.imageUrl}
          >
            Open Box
          </Button>
        </Flex>,
      ]}
      width={700}
      centered
      className="modal-responsive"
    >
      <div>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title="Box Information"
              size="small"
              style={{ marginBottom: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <Text strong>Box Number:</Text>
                  <br />
                  <Text>{box.boxNumber}</Text>
                </div>
                {roomName && (
                  <div>
                    <Text strong>Room:</Text>
                    <br />
                    <Text>{roomName}</Text>
                  </div>
                )}
                <div>
                  <Text strong>Description:</Text>
                  <br />
                  <Text>{box.description}</Text>
                </div>
                <div>
                  <Text strong>Created:</Text>
                  <br />
                  <Text>{box.createdAt.toLocaleDateString()}</Text>
                </div>
              </div>
            </Card>

            <Card title="Summary" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#1890ff",
                      }}
                    >
                      {getItemCount(box)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Total Items
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#52c41a",
                      }}
                    >
                      {getCategoryCount(box)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Categories
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Items in this box" size="small">
              <List
                size="small"
                dataSource={box.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text strong>{item.name}</Text>
                          <Tag color="blue">{item.quantity}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Tag color="green" style={{ marginTop: "4px" }}>
                            {item.category}
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default BoxModal;
