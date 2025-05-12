"use client";
import {
  AttendeeProvider,
  useAttendeeActions,
  useAttendeeState,
} from "@/Providers/Auth";
import { Button, Dropdown, Layout, Menu, theme } from "antd";

import { useRouter } from "next/navigation";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { EventProvider } from "@/Providers/Event";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { CurrentUser } = useAttendeeState();
  const { signOut } = useAttendeeActions();
  const router = useRouter();
  const userMenu = {
    items: [
      {
        key: "1",
        label: "Profile",
      },
      {
        key: "2",
        label: "Settings",
      },
      {
        key: "3",
        label: "Logout",
        onClick: () => {
          router.replace("/");
          signOut();
        },
      },
    ],
  };

  return (
    <EventProvider>
      <AttendeeProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <UserOutlined />,
                  label: "nav 1",
                },
                {
                  key: "2",
                  icon: <VideoCameraOutlined />,
                  label: "nav 2",
                },
                {
                  key: "3",
                  icon: <UploadOutlined />,
                  label: "nav 3",
                },
              ]}
            />
          </Sider>

          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Dropdown menu={userMenu} trigger={["click"]}>
                <Button type="text" icon={<UserOutlined />}>
                  {CurrentUser?.emailAddress ?? "User"}
                </Button>
              </Dropdown>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </AttendeeProvider>
    </EventProvider>
  );
};

export default MainLayout;
