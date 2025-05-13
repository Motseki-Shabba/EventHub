"use client";

import { useEventActions, useEventState } from "@/Providers/Event";
import { IEvent } from "@/Providers/Event/context"; // Added ITicket interface
import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Upload,
} from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload"; // Added UploadFile type
import dayjs from "dayjs";
import Image from "next/image"; // Added for Next.js image optimization
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

// Define ticket types
const TICKET_TYPES = [
  { value: 1, label: "General Admission" },
  { value: 2, label: "VIP" },
  { value: 3, label: "Early Bird" },
  { value: 4, label: "Student" },
  { value: 5, label: "Group" },
];

// Define interfaces for form values
interface EventFormValues {
  name: string;
  description: string;
  location: string;
  price: number;
  eventDates: [dayjs.Dayjs, dayjs.Dayjs]; // Range picker values
  tickets: TicketFormValues[];
  imageUpload?: UploadFile[];
}

interface TicketFormValues {
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: number;
  remainingQuantity?: number;
  eventId?: string;
}

const EventManagement = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<EventFormValues>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<IEvent[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { isPending, isSuccess, isError, errorMessage, events } =
    useEventState();
  const {
    createEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    resetStateFlags,
  } = useEventActions();

  const fetchEvents = async () => {
    try {
      await getAllEvents();
    } catch (error) {
      message.error("Failed to fetch events");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    return () => {
      resetStateFlags();
    };
  }, []); // Added resetStateFlags to dependency array

  useEffect(() => {
    if (isSuccess && !isPending && localSubmitting) {
      setLocalSubmitting(false);
      setIsModalVisible(false);
      form.resetFields();
      setIsEditing(false);
      setCurrentEventId(null);
      setImageUrl(null);
      setFileList([]);
      message.success(
        isEditing ? "Event updated successfully" : "Event created successfully"
      );
    }
  }, [isSuccess, isPending, isEditing, localSubmitting, message, form]); // Added missing dependencies

  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
      setLocalSubmitting(false);
    }
  }, [isError, errorMessage, message]); // Added message to dependency array

  useEffect(() => {
    if (Array.isArray(events)) {
      setFilteredData(events);
    }
  }, [events]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const lowerSearch = value.toLowerCase();
    const filtered = Array.isArray(events)
      ? events.filter(
          (event) =>
            event.name?.toLowerCase().includes(lowerSearch) ||
            event.location?.toLowerCase().includes(lowerSearch) ||
            event.description?.toLowerCase().includes(lowerSearch)
        )
      : [];
    setFilteredData(filtered);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsEditing(false);
    setCurrentEventId(null);
    setImageUrl(null);
    setFileList([]);
    form.setFieldsValue({
      tickets: [{ name: "", description: "", price: 0, quantity: 0, type: 1 }],
    });
    setIsModalVisible(true);
  };

  const showEditModal = (event: IEvent) => {
    setIsEditing(true);
    setCurrentEventId(event.id || null);

    // Format for form
    const formData: Partial<EventFormValues> = {
      ...event,
      eventDates: [dayjs(event.startDate), dayjs(event.endDate)],
      tickets: event.tickets || [
        { name: "", description: "", price: 0, quantity: 0, type: 1 },
      ],
    };

    form.setFieldsValue(formData as EventFormValues);

    if (event.imageUrl) {
      setImageUrl(event.imageUrl);
      setFileList([
        {
          uid: "-1",
          name: "event-image.png",
          status: "done",
          url: event.imageUrl,
        },
      ]);
    } else {
      setImageUrl(null);
      setFileList([]);
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEditing(false);
    setCurrentEventId(null);
    setImageUrl(null);
    setFileList([]);
  };

  const handleSubmit = async (values: EventFormValues) => {
    setLocalSubmitting(true);
    try {
      // Extract start and end dates from the range picker
      const startDate = values.eventDates[0].toISOString();
      const endDate = values.eventDates[1].toISOString();

      // Remove the temporary eventDates field and add separate start/end dates
      const { ...restValues } = values;

      const eventData: IEvent = {
        ...restValues,
        startDate,
        endDate,
        imageUrl,
        organizerIds:
          isEditing && currentEventId
            ? events?.find((e) => e.id === currentEventId)?.organizerIds ?? []
            : [],
        // Ensure tickets are properly formatted
        tickets:
          values.tickets?.map((ticket: TicketFormValues) => ({
            ...ticket,
            eventId: currentEventId || undefined,
            price: Number(ticket.price),
            quantity: Number(ticket.quantity),
            // Ensure remainingQuantity is present if it exists in the initial data
            ...(ticket.remainingQuantity !== undefined && {
              remainingQuantity: Number(ticket.remainingQuantity),
            }),
          })) || [],
      };

      if (isEditing && currentEventId) {
        await updateEvent({ ...eventData, id: currentEventId });
      } else {
        await createEvent(eventData);
      }
    } catch (error) {
      setLocalSubmitting(false);
      message.error(
        isEditing ? "Failed to update event" : "Failed to create event"
      );
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      message.success("Event deleted successfully");
    } catch (error) {
      message.error("Failed to delete event");
      console.error(error);
    }
  };

  // Custom image upload handler
  const handleImageUpload: UploadProps["customRequest"] = ({
    file,
    onSuccess,
  }) => {
    // This is where you would normally upload to your server
    // For this demo, we'll simulate a successful upload and set a data URL
    const reader = new FileReader();
    reader.readAsDataURL(file as RcFile);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      if (onSuccess) onSuccess({}, new XMLHttpRequest());
    };
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: IEvent, b: IEvent) =>
        (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a: IEvent, b: IEvent) =>
        (a.location || "").localeCompare(b.location || ""),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string | undefined) =>
        text ? dayjs(text).format("MMM DD, YYYY HH:mm") : "-",
      sorter: (a: IEvent, b: IEvent) =>
        dayjs(a.startDate || "").unix() - dayjs(b.startDate || "").unix(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string | undefined) =>
        text ? dayjs(text).format("MMM DD, YYYY HH:mm") : "-",
      sorter: (a: IEvent, b: IEvent) =>
        dayjs(a.endDate || "").unix() - dayjs(b.endDate || "").unix(),
    },
    {
      title: "Base Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `R${(price || 0).toFixed(2)}`,
      sorter: (a: IEvent, b: IEvent) => (a.price || 0) - (b.price || 0),
    },
    {
      title: "Ticket Types",
      key: "ticketCount",
      render: (_: unknown, record: IEvent) => record.tickets?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: IEvent) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            type="text"
          />
          <Popconfirm
            title="Delete Event"
            description="Are you sure you want to delete this event?"
            onConfirm={() => handleDelete(record.id || "")}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} type="text" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Events</h2>
        <Search
          placeholder="Search by name, location or description"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          enterButton
          allowClear
          style={{ maxWidth: 400, marginBottom: 20 }}
        />
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchEvents}
            loading={isPending}
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            Add Event
          </Button>
        </Space>
      </div>

      {isError && errorMessage && (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={isPending}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: () => `Total R{total} events`,
        }}
      />

      <Modal
        title={isEditing ? "Edit Event" : "Add New Event"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Spin spinning={isPending || localSubmitting} tip="Processing...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: "",
              description: "",
              location: "",
              price: 0,
              tickets: [
                { name: "", description: "", price: 0, quantity: 0, type: 1 },
              ],
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Event Details</h3>

            <div style={{ display: "flex", gap: "20px" }}>
              <Form.Item
                name="name"
                label="Event Name"
                rules={[{ required: true, message: "Please enter event name" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter event name" maxLength={100} />
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label="Event Description"
              rules={[
                { required: true, message: "Please enter event description" },
              ]}
            >
              <TextArea
                placeholder="Enter event description"
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <div style={{ display: "flex", gap: "20px" }}>
              <Form.Item
                name="eventDates"
                label="Event Date and Time"
                rules={[
                  { required: true, message: "Please select event dates" },
                ]}
                style={{ flex: 1 }}
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                  placeholder={["Start Date & Time", "End Date & Time"]}
                />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <Form.Item
                name="location"
                label="Location"
                rules={[
                  { required: true, message: "Please enter event location" },
                ]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Enter event location" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Base Price"
                rules={[
                  { required: true, message: "Please enter event price" },
                ]}
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  addonBefore="R"
                  style={{ width: "100%" }}
                  placeholder="0.00"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Event Image"
              name="imageUpload"
              valuePropName="fileList"
              getValueFromEvent={(e) => e && e.fileList}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                customRequest={handleImageUpload}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
              >
                {imageUrl ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Using Next.js Image component instead of img */}
                    <Image
                      src={imageUrl}
                      alt="Event"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Divider />

            <h3 style={{ marginBottom: "16px" }}>Tickets</h3>
            <Form.List name="tickets">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: "20px",
                        padding: "15px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ margin: 0 }}>Ticket {name + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "20px" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          label="Ticket Name"
                          rules={[
                            {
                              required: true,
                              message: "Please enter ticket name",
                            },
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Input placeholder="Ticket name" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "type"]}
                          label="Ticket Type"
                          rules={[
                            {
                              required: true,
                              message: "Please select ticket type",
                            },
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Select placeholder="Select a ticket type">
                            {TICKET_TYPES.map((type) => (
                              <Option key={type.value} value={type.value}>
                                {type.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Please enter ticket description",
                          },
                        ]}
                      >
                        <TextArea placeholder="Ticket description" rows={2} />
                      </Form.Item>

                      <div style={{ display: "flex", gap: "20px" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "price"]}
                          label="Price"
                          rules={[{ required: true, message: "Required" }]}
                          style={{ flex: 1 }}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="Price"
                            addonBefore="R"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label="Quantity"
                          rules={[{ required: true, message: "Required" }]}
                          style={{ flex: 1 }}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Quantity"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          name: "",
                          description: "",
                          price: 0,
                          quantity: 0,
                          type: 1,
                        })
                      }
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Ticket Type
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending || localSubmitting}
                  icon={<SaveOutlined />}
                >
                  {isEditing ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

// Wrap with App component to provide message context
const EventManagementWithApp = () => (
  <App>
    <EventManagement />
  </App>
);

export default EventManagementWithApp;
