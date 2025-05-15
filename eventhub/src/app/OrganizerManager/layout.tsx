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
import { OrganizerProvider } from "@/Providers/Organizer";

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
    <OrganizerProvider>
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
                    key: "/OrganizerManager",
                    icon: <UserOutlined />,
                    label: "home",
                  },
                  {
                    key: "/OrganizerManager/CreateEvent",
                    icon: <VideoCameraOutlined />,
                    label: "Create Events",
                  },
                  {
                    key: "/OrganizerManager/ViewEvents",
                    icon: <UploadOutlined />,
                    label: "View Events",
                  },
                ]}
                onClick={({ key }) => router.push(key)}
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
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
                <div>
                  <h2>Organizer Dashboard</h2>
                </div>
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
    </OrganizerProvider>
  );
};

export default MainLayout;
