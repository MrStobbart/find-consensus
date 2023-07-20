import Space from "antd/es/space";
import Title from "antd/es/typography/Title";
import Button from "antd/es/button";
import Input from "antd/es/input";
import { useState } from "react";
import Card from "antd/es/card";
import Modal from "antd/es/modal";
import Row from "antd/es/row";
import Col from "antd/es/col";
import { DeleteOutlined } from "@ant-design/icons";

export type ItemDisplayProps = {
  name: string;
  onOpen: () => void;
  onDelete: () => void;
};

export function ItemDisplay({ name, onOpen, onDelete }: ItemDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          borderRadius: "6px",
          padding: "4px 11px",
          border: "1px solid #d9d9d9",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <Button onClick={onOpen} type="text">
            {name}
          </Button>
        </Col>
        <Col>
          <Button
            icon={<DeleteOutlined />}
            type="text"
            shape="round"
            onClick={() => setIsModalOpen(true)}
          ></Button>
        </Col>
      </Row>
      <Modal
        title={`Do you want to delete "${name}"?`}
        open={isModalOpen}
        onOk={onDelete}
        onCancel={() => setIsModalOpen(false)}
      ></Modal>
    </>
  );
}
