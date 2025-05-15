"use client";

import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  IeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Alert, Card, Col, Modal, Radio, Row, Spin, Statistic } from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

import { useEventActions, useEventState } from "@/Providers/Event/index";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

interface Event {
  id?: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  price: number;
  tickets: Ticket[];
}

interface Ticket {
  id: string;
  name: string;
  quantity: number;
  price: number;
  remainingQuantity?: number;
}

interface TicketAvailabilityData {
  sold: number;
  remaining: number;
}

interface PriceRanges {
  "R0-50": number;
  "R51-100": number;
  "R101-200": number;
  "R201-500": number;
  "R500+": number;
}

const EventCharts: React.FC = () => {
  const { getAllEvents } = useEventActions();
  const { events, isPending, isSuccess, isError } = useEventState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalChart, setModalChart] = useState<{
    title: string;
    element: React.ReactNode;
  } | null>(null);
  const [timeFilter, setTimeFilter] = useState("upcoming");

  const openChartModal = (title: string, chartElement: React.ReactNode) => {
    setModalChart({ title, element: chartElement });
    setIsModalVisible(true);
  };

  const closeChartModal = () => {
    setIsModalVisible(false);
    setModalChart(null);
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const eventsList = events ?? [];

  if (isPending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" tip="Loading event data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "2rem" }}>
        <Alert message="Failed to load event data." type="error" showIcon />
      </div>
    );
  }

  if (isSuccess && eventsList.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <Alert message="No event data available." type="info" showIcon />
      </div>
    );
  }

  const filterEventsByTime = (data: Event[]) => {
    const now = moment();

    switch (timeFilter) {
      case "upcoming":
        return data.filter((item) => moment(item.startDate).isAfter(now));
      case "past":
        return data.filter((item) => moment(item.endDate).isBefore(now));
      case "ongoing":
        return data.filter(
          (item) =>
            moment(item.startDate).isBefore(now) &&
            moment(item.endDate).isAfter(now)
        );
      case "month":
        return data.filter((item) =>
          moment(item.startDate).isBetween(
            now,
            moment().add(30, "days"),
            undefined,
            "[]"
          )
        );
      case "all":
        return data;
      default:
        return data;
    }
  };

  //  const filterEventsByTime = (data: Event[]) => {
  //   const now = moment();

  //   switch (timeFilter) {
  //     case "upcoming":
  //       return data.filter((item) => moment(item.startDate).isAfter(now));
  //     case "past":
  //       return data.filter((item) => moment(item.endDate).isBefore(now));
  //     case "ongoing":
  //       return data.filter(
  //         (item) =>
  //           moment(item.startDate).isBefore(now) &&
  //           moment(item.endDate).isAfter(now)
  //       );
  //     case "month":
  //       return data.filter((item) =>
  //         moment(item.startDate).isBetween(
  //           now,
  //           moment().add(30, "days"),
  //           undefined,
  //           "[]"
  //         )
  //       );
  //     case "all":
  //       return data;
  //     default:
  //       return data;
  //   }
  // };

  // The mapping code can remain the same
  const filteredEvents = filterEventsByTime(
    eventsList.map((event) => ({
      ...event,
      startDate:
        typeof event.startDate === "string"
          ? event.startDate
          : event.startDate.toISOString(),
      endDate:
        typeof event.endDate === "string"
          ? event.endDate
          : event.endDate.toISOString(),
      tickets: event.tickets.map((ticket) => ({
        ...ticket,
        id: ticket.id || "", // Ensure id is always a string
      })),
    }))
  );

  // Calculate summary statistics
  const totalEvents = filteredEvents.length;
  const totalTickets = filteredEvents.reduce(
    (sum, event) =>
      sum +
      event.tickets.reduce(
        (tSum: number, ticket: Ticket) => tSum + ticket.quantity,
        0
      ),
    0
  );
  const totalRevenue = filteredEvents.reduce(
    (sum, event) =>
      sum +
      event.tickets.reduce(
        (tSum: number, ticket: Ticket) => tSum + ticket.price * ticket.quantity,
        0
      ),
    0
  );
  const averagePrice =
    totalEvents > 0
      ? filteredEvents.reduce((sum, event) => sum + event.price, 0) /
        totalEvents
      : 0;

  // Group events by location
  const locationCounts = filteredEvents.reduce(
    (acc: Record<string, number>, event) => {
      acc[event.location] = (acc[event.location] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Events by month
  const eventsByMonth = filteredEvents.reduce(
    (acc: Record<string, number>, event) => {
      const month = moment(event.startDate).format("YYYY-MM");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Ticket availability
  const ticketData = filteredEvents.reduce<TicketAvailabilityData>(
    (acc, event) => {
      event.tickets.forEach((ticket: Ticket) => {
        const remaining =
          ticket.remainingQuantity !== undefined
            ? ticket.remainingQuantity
            : ticket.quantity;
        const sold = ticket.quantity - remaining;
        acc.sold += sold;
        acc.remaining += remaining;
      });
      return acc;
    },
    { sold: 0, remaining: 0 }
  );

  // Revenue by event
  const revenueByEvent = filteredEvents
    .map((event) => ({
      name: event.name,
      revenue: event.tickets.reduce(
        (sum: number, ticket: Ticket) =>
          sum +
          ticket.price * (ticket.quantity - (ticket.remainingQuantity || 0)),
        0
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Events by price range
  const priceRanges: PriceRanges = {
    "R0-50": 0,
    "R51-100": 0,
    "R101-200": 0,
    "R201-500": 0,
    "R500+": 0,
  };

  filteredEvents.forEach((event) => {
    if (event.price <= 50) priceRanges["R0-50"]++;
    else if (event.price <= 100) priceRanges["R51-100"]++;
    else if (event.price <= 200) priceRanges["R101-200"]++;
    else if (event.price <= 500) priceRanges["R201-500"]++;
    else priceRanges["R500+"]++;
  });

  // Prepare chart data
  const sortedMonths = Object.keys(eventsByMonth).sort();
  const eventsByMonthData = {
    labels: sortedMonths.map((m) => moment(m).format("MMM YYYY")),
    datasets: [
      {
        label: "Number of Events",
        data: sortedMonths.map((m) => eventsByMonth[m]),
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        tension: 0.3,
      },
    ],
  };

  const eventsByLocationData = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: "Events by Location",
        data: Object.values(locationCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC926",
          "#1982C4",
          "#6A4C93",
          "#F94144",
        ],
      },
    ],
  };

  const ticketAvailabilityData = {
    labels: ["Sold Tickets", "Remaining Tickets"],
    datasets: [
      {
        data: [ticketData.sold, ticketData.remaining],
        backgroundColor: ["#2196f3", "#ff9800"],
      },
    ],
  };

  const revenueByEventData = {
    labels: revenueByEvent.map((e) =>
      e.name.length > 15 ? e.name.substring(0, 15) + "..." : e.name
    ),
    datasets: [
      {
        label: "Revenue",
        data: revenueByEvent.map((e) => e.revenue),
        backgroundColor: "#4caf50",
      },
    ],
  };

  const priceRangeData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Events by Price Range",
        data: Object.values(priceRanges),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "upcoming":
        return "Upcoming Events";
      case "past":
        return "Past Events";
      case "ongoing":
        return "Ongoing Events";
      case "month":
        return "Events in Next 30 Days";
      case "all":
        return "All Events";
      default:
        return "All Events";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: -20,
        padding: "20px",
        height: "90vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Events Dashboard
        </h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FilterOutlined style={{ marginRight: 8 }} />
          <span style={{ marginRight: 8 }}>Filter by: </span>
          <Radio.Group
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="upcoming">Upcoming</Radio.Button>
            <Radio.Button value="past">Past</Radio.Button>
            <Radio.Button value="ongoing">Ongoing</Radio.Button>
            <Radio.Button value="month">Next 30 Days</Radio.Button>
            <Radio.Button value="all">All Events</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <div
        style={{
          marginBottom: 15,
          padding: "8px 16px",
          background: "#f0f5ff",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <InfoCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        <span>
          Currently showing data for: <strong>{getTimeFilterLabel()}</strong>
        </span>
      </div>

      {/* Stats Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Events"
              value={totalEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Tickets"
              value={totalTickets}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Projected Revenue"
              value={totalRevenue}
              precision={2}
              prefix={"R"}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Price"
              value={averagePrice}
              precision={2}
              prefix={"R"}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            openChartModal(
              `Events by Month - ${getTimeFilterLabel()}`,
              <Line data={eventsByMonthData} />
            )
          }
        >
          <h3 style={{ marginBottom: "16px" }}>Events by Month</h3>
          <Line data={eventsByMonthData} />
        </div>

        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            openChartModal(
              `Events by Location - ${getTimeFilterLabel()}`,
              <Pie data={eventsByLocationData} />
            )
          }
        >
          <h3 style={{ marginBottom: "16px" }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            Events by Location
          </h3>
          <Pie data={eventsByLocationData} />
        </div>

        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            openChartModal(
              `Ticket Availability - ${getTimeFilterLabel()}`,
              <Doughnut data={ticketAvailabilityData} />
            )
          }
        >
          <h3 style={{ marginBottom: "16px" }}>
            <IeOutlined style={{ marginRight: 8 }} />
            Ticket Availability
          </h3>
          <Doughnut data={ticketAvailabilityData} />
        </div>

        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            openChartModal(
              `Revenue by Event - ${getTimeFilterLabel()}`,
              <Bar data={revenueByEventData} />
            )
          }
        >
          <h3 style={{ marginBottom: "16px" }}>
            <DollarOutlined style={{ marginRight: 8 }} />
            Top Revenue Generating Events
          </h3>
          <Bar
            data={revenueByEventData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            openChartModal(
              `Events by Price Range - ${getTimeFilterLabel()}`,
              <Pie data={priceRangeData} />
            )
          }
        >
          <h3 style={{ marginBottom: "16px" }}>
            <DollarOutlined style={{ marginRight: 8 }} />
            Events by Price Range
          </h3>
          <Pie data={priceRangeData} />
        </div>
      </div>

      <Modal
        title={modalChart?.title}
        open={isModalVisible}
        onCancel={closeChartModal}
        footer={null}
        width={800}
      >
        <div style={{ height: 400 }}>{modalChart?.element}</div>
      </Modal>
    </div>
  );
};

export default EventCharts;
