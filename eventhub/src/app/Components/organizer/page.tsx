// // pages/organizers/index.tsx
// "use client";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   InfoCircleOutlined,
//   PlusOutlined,
//   SearchOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import {
//   Avatar,
//   Button,
//   Form,
//   Input,
//   message,
//   Modal,
//   Popconfirm,
//   Space,
//   Table,
//   Tooltip,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import styles from "./style/organizer.module.css";

// // Types
// interface Organizer {
//   id: string;
//   name: string;
//   surname: string;
//   username: string;
//   email: string;
//   organisationName: string;
//   contactInfo: string;
//   nationalIdNumber: string;
//   address: string;
//   profileImageUrl?: string;
//   eventHubAdmin: boolean;
// }

// const OrganizerManagement: React.FC = () => {
//   // State
//   const [organizers, setOrganizers] = useState<Organizer[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(10);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//   const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
//   const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
//     null
//   );
//   const [form] = Form.useForm();
//   const [modalMode, setModalMode] = useState<"create" | "edit">("create");

//   // Fetch organizers
//   const fetchOrganizers = async () => {
//     try {
//       setLoading(true);
//       // In a real app, you'd make an API call here
//       // Example: const response = await fetch(`/api/organizers?skipCount=${(currentPage - 1) * pageSize}&maxResultCount=${pageSize}&filter=${searchTerm}`);

//       // Mock data for demonstration
//       const mockData: Organizer[] = Array(10)
//         .fill(null)
//         .map((_, index) => ({
//           id: `${index + 1}`,
//           name: `John ${index + 1}`,
//           surname: `Doe ${index + 1}`,
//           username: `johndoe${index + 1}`,
//           email: `johndoe${index + 1}@example.com`,
//           organisationName: `Org ${index + 1}`,
//           contactInfo: `+1234567890${index}`,
//           nationalIdNumber: `ID-${100000 + index}`,
//           address: `123 Main St, City ${index + 1}`,
//           profileImageUrl:
//             index % 3 === 0
//               ? `https://randomuser.me/api/portraits/men/${index}.jpg`
//               : undefined,
//           eventHubAdmin: index % 5 === 0,
//         }));

//       setOrganizers(mockData);
//       setTotalCount(100); // Mock total count
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch organizers:", error);
//       message.error("Failed to load organizers");
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchOrganizers();
//   }, [currentPage, pageSize, searchTerm]);

//   // Handlers
//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   const showCreateModal = () => {
//     form.resetFields();
//     setModalMode("create");
//     setIsModalVisible(true);
//   };

//   const showEditModal = (organizer: Organizer) => {
//     setSelectedOrganizer(organizer);
//     form.setFieldsValue({
//       ...organizer,
//       password: "", // Don't populate password field for security
//     });
//     setModalMode("edit");
//     setIsModalVisible(true);
//   };

//   const showViewModal = (organizer: Organizer) => {
//     setSelectedOrganizer(organizer);
//     setIsViewModalVisible(true);
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const handleViewModalCancel = () => {
//     setIsViewModalVisible(false);
//   };

//   const handleFormSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       if (modalMode === "create") {
//         // API call to create organizer
//         // Example: await fetch('/api/organizers', { method: 'POST', body: JSON.stringify(values) });
//         message.success(`Organizer ${values.name} created successfully`);
//       } else {
//         // API call to update organizer
//         // Example: await fetch(`/api/organizers/${selectedOrganizer?.id}`, { method: 'PUT', body: JSON.stringify(values) });
//         message.success(`Organizer ${values.name} updated successfully`);
//       }

//       setIsModalVisible(false);
//       form.resetFields();
//       fetchOrganizers();
//     } catch (error) {
//       console.error("Form submission failed:", error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       // API call to delete organizer
//       // Example: await fetch(`/api/organizers/${id}`, { method: 'DELETE' });
//       setOrganizers((prev) => prev.filter((org) => org.id !== id));
//       message.success("Organizer deleted successfully");
//       fetchOrganizers();
//     } catch {
//       console.error("Delete failed:");
//       message.error("Failed to delete organizer");
//     }
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "Profile",
//       dataIndex: "profileImageUrl",
//       key: "profileImageUrl",
//       render: (text: string, record: Organizer) => (
//         <Avatar
//           size={40}
//           src={record.profileImageUrl}
//           icon={<UserOutlined />}
//           className={styles.avatar}
//         />
//       ),
//       width: 80,
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       render: (text: string, record: Organizer) =>
//         `${record.name} ${record.surname}`,
//     },
//     {
//       title: "Username",
//       dataIndex: "username",
//       key: "username",
//     },
//     {
//       title: "Organization",
//       dataIndex: "organisationName",
//       key: "organisationName",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Admin",
//       dataIndex: "eventHubAdmin",
//       key: "eventHubAdmin",
//       render: (admin: boolean) => (admin ? "Yes" : "No"),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: string, record: Organizer) => (
//         <Space size="middle">
//           <Tooltip title="View Details">
//             <Button
//               icon={<InfoCircleOutlined />}
//               onClick={() => showViewModal(record)}
//               type="text"
//               className={styles.actionButton}
//             />
//           </Tooltip>
//           <Tooltip title="Edit">
//             <Button
//               icon={<EditOutlined />}
//               onClick={() => showEditModal(record)}
//               type="text"
//               className={styles.actionButton}
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Popconfirm
//               title="Are you sure you want to delete this organizer?"
//               onConfirm={() => handleDelete(record.id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Button
//                 icon={<DeleteOutlined />}
//                 danger
//                 type="text"
//                 className={styles.actionButton}
//               />
//             </Popconfirm>
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1>Organizer Management</h1>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={showCreateModal}
//           className={styles.addButton}
//         >
//           Add Organizer
//         </Button>
//       </div>

//       <div className={styles.searchContainer}>
//         <Input
//           placeholder="Search organizers..."
//           prefix={<SearchOutlined />}
//           onChange={(e) => handleSearch(e.target.value)}
//           className={styles.searchInput}
//           allowClear
//         />
//       </div>

//       <Table
//         columns={columns}
//         dataSource={organizers}
//         rowKey="id"
//         loading={loading}
//         pagination={{
//           current: currentPage,
//           pageSize: pageSize,
//           total: totalCount,
//           onChange: (page) => setCurrentPage(page),
//           onShowSizeChange: (_, size) => setPageSize(size),
//           showSizeChanger: true,
//           showTotal: (total) => `Total ${total} organizers`,
//         }}
//         className={styles.table}
//       />

//       {/* Create/Edit Modal */}
//       <Modal
//         title={modalMode === "create" ? "Create Organizer" : "Edit Organizer"}
//         open={isModalVisible}
//         onCancel={handleModalCancel}
//         onOk={handleFormSubmit}
//         width={800}
//         className={styles.formModal}
//       >
//         <Form form={form} layout="vertical" className={styles.form}>
//           <div className={styles.formRow}>
//             <Form.Item
//               name="name"
//               label="First Name"
//               rules={[{ required: true, message: "Please enter first name" }]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="surname"
//               label="Last Name"
//               rules={[{ required: true, message: "Please enter last name" }]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <div className={styles.formRow}>
//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: "Please enter email" },
//                 { type: "email", message: "Please enter a valid email" },
//               ]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="organisationName"
//               label="Organization Name"
//               rules={[
//                 { required: true, message: "Please enter organization name" },
//               ]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <div className={styles.formRow}>
//             <Form.Item
//               name="username"
//               label="Username"
//               rules={[{ required: true, message: "Please enter username" }]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="password"
//               label={
//                 modalMode === "create"
//                   ? "Password"
//                   : "New Password (leave blank to keep current)"
//               }
//               rules={[
//                 {
//                   required: modalMode === "create",
//                   message: "Please enter password",
//                 },
//               ]}
//               className={styles.formItem}
//             >
//               <Input.Password />
//             </Form.Item>
//           </div>

//           <div className={styles.formRow}>
//             <Form.Item
//               name="nationalIdNumber"
//               label="National ID Number"
//               rules={[
//                 { required: true, message: "Please enter national ID number" },
//               ]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="contactInfo"
//               label="Contact Information"
//               rules={[
//                 { required: true, message: "Please enter contact information" },
//               ]}
//               className={styles.formItem}
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <Form.Item
//             name="address"
//             label="Address"
//             rules={[{ required: true, message: "Please enter address" }]}
//           >
//             <Input.TextArea rows={3} />
//           </Form.Item>

//           <Form.Item name="profileImageUrl" label="Profile Image URL">
//             <Input placeholder="https://example.com/image.jpg" />
//           </Form.Item>

//           <Form.Item
//             name="eventHubAdmin"
//             valuePropName="checked"
//             label="Event Hub Admin"
//           >
//             <Input type="checkbox" />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* View Details Modal */}
//       {selectedOrganizer && (
//         <Modal
//           title="Organizer Details"
//           open={isViewModalVisible}
//           onCancel={handleViewModalCancel}
//           footer={[
//             <Button key="close" onClick={handleViewModalCancel}>
//               Close
//             </Button>,
//           ]}
//           width={600}
//           className={styles.viewModal}
//         >
//           <div className={styles.organizerDetails}>
//             <div className={styles.detailsHeader}>
//               <Avatar
//                 size={80}
//                 src={selectedOrganizer.profileImageUrl}
//                 icon={<UserOutlined />}
//                 className={styles.detailsAvatar}
//               />
//               <div className={styles.nameSection}>
//                 <h2>{`${selectedOrganizer.name} ${selectedOrganizer.surname}`}</h2>
//                 <p className={styles.organization}>
//                   {selectedOrganizer.organisationName}
//                 </p>
//               </div>
//             </div>

//             <div className={styles.detailsGrid}>
//               <div className={styles.detailItem}>
//                 <strong>Username:</strong> {selectedOrganizer.username}
//               </div>
//               <div className={styles.detailItem}>
//                 <strong>Email:</strong> {selectedOrganizer.email}
//               </div>
//               <div className={styles.detailItem}>
//                 <strong>Contact:</strong> {selectedOrganizer.contactInfo}
//               </div>
//               <div className={styles.detailItem}>
//                 <strong>National ID:</strong>{" "}
//                 {selectedOrganizer.nationalIdNumber}
//               </div>
//               <div className={styles.detailItem}>
//                 <strong>Admin:</strong>{" "}
//                 {selectedOrganizer.eventHubAdmin ? "Yes" : "No"}
//               </div>
//               <div className={styles.detailItem}>
//                 <strong>Address:</strong> {selectedOrganizer.address}
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default OrganizerManagement;
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
