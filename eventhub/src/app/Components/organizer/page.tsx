"use client";
import { useOrganizerActions, useOrganizerState } from "@/Providers/Organizer";
import { IOrganizer } from "@/Providers/Organizer/context";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import styles from "./style/organizer.module.css";

const { Title } = Typography;
const { Option } = Select;

const OrganizerManagement = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [editingOrganizer, setEditingOrganizer] = useState<IOrganizer | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    createOrganizer,
    getAllOrganizers,
    deleteOrganizer,
    updateOrganizer,
    resetStateFlags,
  } = useOrganizerActions();

  const { isPending, isSuccess, isError, errorMessage, organizers } =
    useOrganizerState();

  useEffect(() => {
    getAllOrganizers().catch((error) => {
      console.error("Failed to load organizers:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) {
      message.success("Operation completed successfully!");
      form.resetFields();
      resetStateFlags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSubmit = async (values: IOrganizer) => {
    try {
      await createOrganizer(values);
      getAllOrganizers();
    } catch (error) {
      console.error("Error creating organizer:", error);
    }
  };

  const handleEdit = (organizer: IOrganizer) => {
    setEditingOrganizer(organizer);
    setIsModalVisible(true);
    // We need to wait for the modal to be visible before setting form values
    setTimeout(() => {
      form.setFieldsValue({
        ...organizer,
        // Ensure we don't show the password in the form
        password: "",
      });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrganizer(id);
      message.success("Organizer deleted successfully!");
      getAllOrganizers();
    } catch (error) {
      console.error("Error deleting organizer:", error);
      message.error("Failed to delete organizer");
    }
  };

  const handleUpdateSubmit = async (values: IOrganizer) => {
    if (!editingOrganizer?.id) return;

    try {
      const updatedOrganizer = {
        ...values,
        id: editingOrganizer.id,
      };
      await updateOrganizer(updatedOrganizer);
      setIsModalVisible(false);
      getAllOrganizers();
    } catch (error) {
      console.error("Error updating organizer:", error);
      message.error("Failed to update organizer");
    }
  };

  const filteredOrganizers = organizers?.filter((organizer) =>
    Object.values(organizer).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IOrganizer) =>
        `${record.name} ${record.surname}`,
    },
    {
      title: "Organization",
      dataIndex: "organisationName",
      key: "organisationName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md" as const],
    },
    {
      title: "Contact",
      dataIndex: "contactInfo",
      key: "contactInfo",
      responsive: ["lg" as const],
    },
    {
      title: "Admin",
      dataIndex: "eventHubAdmin",
      key: "eventHubAdmin",
      render: (value: string) => (value === "true" ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: IOrganizer) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this organizer?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>
        Organizer Management
      </Title>

      <Card className={styles.formContainer}>
        <div className={styles.formSection}>
          <Title level={4} className={styles.sectionTitle}>
            Create New Organizer
          </Title>
          {isError && (
            <Alert
              message="Error"
              description={errorMessage || "Failed to process your request"}
              type="error"
              showIcon
              className={styles.errorMessage}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={isPending}
          >
            <Row gutter={24}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="name"
                  label={<span className={styles.required}>First Name</span>}
                  rules={[
                    { required: true, message: "Please enter first name" },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="surname"
                  label={<span className={styles.required}>Last Name</span>}
                  rules={[
                    { required: true, message: "Please enter last name" },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  name="organisationName"
                  label={
                    <span className={styles.required}>Organization Name</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter organization name",
                    },
                  ]}
                >
                  <Input placeholder="Organization Name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="email"
                  label={<span className={styles.required}>Email</span>}
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="username"
                  label={<span className={styles.required}>Username</span>}
                  rules={[{ required: true, message: "Please enter username" }]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  name="password"
                  label={<span className={styles.required}>Password</span>}
                  rules={[
                    { required: true, message: "Please enter password" },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="contactInfo"
                  label={
                    <span className={styles.required}>Contact Information</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter contact information",
                    },
                  ]}
                >
                  <Input placeholder="Contact Information" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="nationalIdNumber"
                  label={
                    <span className={styles.required}>National ID Number</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter national ID number",
                    },
                  ]}
                >
                  <Input placeholder="National ID Number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item name="address" label="Address">
                  <Input.TextArea rows={2} placeholder="Address" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item name="profileImageUrl" label="Profile Image URL">
                  <Input placeholder="Profile Image URL" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="eventHubAdmin"
                  label="Admin Role"
                  initialValue="false"
                >
                  <Select>
                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <div className={styles.formActions}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  icon={<PlusOutlined />}
                >
                  Create Organizer
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>

      <Card className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <Title level={4}>Organizers List</Title>
          <div className={styles.searchContainer}>
            <Input
              placeholder="Search organizers..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {isPending && !organizers?.length ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrganizers || []}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>

      {/* Edit Organizer Modal */}
      <Modal
        title="Edit Organizer"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateSubmit}
          disabled={isPending}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="surname"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="contactInfo"
                label="Contact Information"
                rules={[
                  {
                    required: true,
                    message: "Please enter contact information",
                  },
                ]}
              >
                <Input placeholder="Contact Information" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nationalIdNumber"
                label="National ID Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter national ID number",
                  },
                ]}
              >
                <Input placeholder="National ID Number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="address" label="Address">
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="profileImageUrl" label="Profile Image URL">
                <Input placeholder="Profile Image URL" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="eventHubAdmin" label="Admin Role">
                <Select>
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div className={styles.formActions}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  icon={<EditOutlined />}
                >
                  Update Organizer
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizerManagement;
