"use client";

import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";
import ConfigProvider from "antd/es/config-provider";
import { useRouter, useServerInsertedHTML } from "next/navigation";
import React from "react";
import theme from "./themeConfig";
import Layout from "antd/es/layout";
import Space from "antd/es/space";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Menu from "antd/es/menu";
import Button from "antd/es/button";
import Divider from "antd/es/divider";
import Row from "antd/es/row";
import Col from "antd/es/col";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  height: 64,
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
};

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const cache = createCache();
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return (
    <StyleProvider cache={cache}>
      <ConfigProvider theme={theme}>
        <Row
          style={{
            width: "100%",
            backgroundColor: "lightsalmon",
            minHeight: "100%",
          }}
          justify="center"
        >
          <Col>
            <Row
              style={{
                width: "576px",
                backgroundColor: "lightcyan",
              }}
              justify="center"
            >
              <Col
                style={{
                  width: "100%",
                  textAlign: "center",
                  minHeight: "100vh",
                  padding: "16px",
                }}
              >
                <Space>
                  <Button
                    icon={<LeftOutlined />}
                    type="primary"
                    size="large"
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      router.push(`/`);
                    }}
                  >
                    View all surveys
                  </Button>
                  <Button
                    icon={<RightOutlined />}
                    type="primary"
                    size="large"
                    onClick={() => {
                      router.forward();
                    }}
                  />
                </Space>
                <Divider />
                {children}
              </Col>
            </Row>
          </Col>
        </Row>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry;
