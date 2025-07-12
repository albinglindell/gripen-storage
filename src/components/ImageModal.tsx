import React from "react";
import { Modal, Button, Typography, Image } from "antd";
import { CardboardBox } from "../types/storage";

const { Text } = Typography;

interface ImageModalProps {
  box: CardboardBox | null;
  isVisible: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ box, isVisible, onClose }) => {
  if (!box?.imageUrl) return null;

  return (
    <Modal
      title={`Box ${box.boxNumber} - Image View`}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
      className="modal-responsive"
    >
      <div style={{ textAlign: "center" }}>
        <Image
          src={box.imageUrl}
          alt={`Box ${box.boxNumber} contents`}
          style={{ maxWidth: "100%", maxHeight: "500px" }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
        <div style={{ marginTop: "16px" }}>
          <Text type="secondary">Image of Box {box.boxNumber} contents</Text>
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
