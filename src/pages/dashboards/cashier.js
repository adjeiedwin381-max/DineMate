import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  AttachMoney,
  CreditCard,
  Smartphone,
  TrendingUp,
  ReceiptLong,
  Cancel,
  Insights,
  Search,
  FilterAlt,
  RestartAlt,
  FileDownload,
  ContentCopy,
  Print,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- Mock Data ---
const salesData = [
  { day: "Mon", sales: 200 },
  { day: "Tue", sales: 300 },
  { day: "Wed", sales: 250 },
  { day: "Thu", sales: 400 },
  { day: "Fri", sales: 500 },
  { day: "Sat", sales: 600 },
  { day: "Sun", sales: 350 },
];

const initialTransactions = [
  {
    id: "TX-201",
    order: "ORD-120",
    amount: 25,
    method: "Cash",
    status: "Paid",
    date: "2025-08-21",
  },
  {
    id: "TX-202",
    order: "ORD-121",
    amount: 40,
    method: "Card",
    status: "Paid",
    date: "2025-08-21",
  },
  {
    id: "TX-203",
    order: "ORD-122",
    amount: 18,
    method: "Mobile",
    status: "Paid",
    date: "2025-08-22",
  },
  {
    id: "TX-204",
    order: "ORD-123",
    amount: 32,
    method: "Card",
    status: "Refunded",
    date: "2025-08-22",
  },
  {
    id: "TX-205",
    order: "ORD-124",
    amount: 58,
    method: "Cash",
    status: "Paid",
    date: "2025-08-23",
  },
  {
    id: "TX-206",
    order: "ORD-125",
    amount: 17,
    method: "Mobile",
    status: "Canceled",
    date: "2025-08-23",
  },
];

const COLORS = ["#4caf50", "#2196f3", "#ff9800"];

export default function CashierReportsAdvanced() {
  // Filters
  const [query, setQuery] = useState("");
  const [methods, setMethods] = useState(["Cash", "Card", "Mobile"]);
  const [statuses, setStatuses] = useState(["Paid", "Refunded", "Canceled"]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");

  const transactions = initialTransactions;

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        tx.id.toLowerCase().includes(q) ||
        tx.order.toLowerCase().includes(q);
      const matchesMethod = methods.includes(tx.method);
      const matchesStatus = statuses.includes(tx.status);
      const txDate = new Date(tx.date);
      const fromOk = dateFrom ? txDate >= new Date(dateFrom) : true;
      const toOk = dateTo ? txDate <= new Date(dateTo) : true;
      const amtOk =
        (minAmt === "" || tx.amount >= Number(minAmt)) &&
        (maxAmt === "" || tx.amount <= Number(maxAmt));
      return (
        matchesQuery &&
        matchesMethod &&
        matchesStatus &&
        fromOk &&
        toOk &&
        amtOk
      );
    });
  }, [
    transactions,
    query,
    methods,
    statuses,
    dateFrom,
    dateTo,
    minAmt,
    maxAmt,
  ]);

  const totals = useMemo(() => {
    const sum = filtered.reduce((acc, t) => acc + t.amount, 0);
    const avg = filtered.length ? sum / filtered.length : 0;
    const refunds = filtered.filter((t) => t.status === "Refunded").length;
    return { sum, count: filtered.length, avg, refunds };
  }, [filtered]);

  const paymentBreakdown = useMemo(() => {
    const map = { Cash: 0, Card: 0, Mobile: 0 };
    filtered.forEach((t) => (map[t.method] += t.amount));
    return [
      { name: "Cash", value: map.Cash },
      { name: "Card", value: map.Card },
      { name: "Mobile", value: map.Mobile },
    ];
  }, [filtered]);

  const toCSV = (rows) => {
    const headers = ["id", "order", "amount", "method", "status", "date"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [r.id, r.order, r.amount, r.method, r.status, r.date]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  const download = (filename, content, type = "text/csv") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () =>
    download("cashier-transactions.csv", toCSV(filtered));
  const handleExportJSON = () =>
    download(
      "cashier-transactions.json",
      JSON.stringify(filtered, null, 2),
      "application/json"
    );
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toCSV(filtered));
    } catch {}
  };
  const handlePrint = () => window.print();

  const resetFilters = () => {
    setQuery("");
    setMethods(["Cash", "Card", "Mobile"]);
    setStatuses(["Paid", "Refunded", "Canceled"]);
    setDateFrom("");
    setDateTo("");
    setMinAmt("");
    setMaxAmt("");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Insights sx={{ color: "primary.main", fontSize: 40 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Cashier Reports
        </Typography>
      </Stack>

      {/* Filters */}
      <Card
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          mb: 3,
          background: "#f9f9fb",
        }}
      >
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              size="small"
              label="Search ID / Order"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              multiple
              size="small"
              value={methods}
              onChange={(e) => setMethods(e.target.value)}
              input={<OutlinedInput />}
              sx={{ minWidth: 180 }}
            >
              {["Cash", "Card", "Mobile"].map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
            <Select
              multiple
              size="small"
              value={statuses}
              onChange={(e) => setStatuses(e.target.value)}
              input={<OutlinedInput />}
              sx={{ minWidth: 180 }}
            >
              {["Paid", "Refunded", "Canceled"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              type="date"
              label="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              type="number"
              label="Min $"
              value={minAmt}
              onChange={(e) => setMinAmt(e.target.value)}
              sx={{ width: 100 }}
            />
            <TextField
              size="small"
              type="number"
              label="Max $"
              value={maxAmt}
              onChange={(e) => setMaxAmt(e.target.value)}
              sx={{ width: 100 }}
            />
            <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
              <Tooltip title="Reset Filters">
                <IconButton onClick={resetFilters}>
                  <RestartAlt />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export CSV">
                <IconButton onClick={handleExportCSV}>
                  <FileDownload />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export JSON">
                <IconButton onClick={handleExportJSON}>
                  <CodeIconLike />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy CSV">
                <IconButton onClick={handleCopy}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint}>
                  <Print />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <KpiCard
            icon={<TrendingUp color="success" />}
            title="Total Sales"
            value={`$${totals.sum.toFixed(2)}`}
            color="#e8f5e9"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            icon={<ReceiptLong color="info" />}
            title="Transactions"
            value={totals.count}
            color="#e3f2fd"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            icon={<AttachMoney color="warning" />}
            title="Avg Order"
            value={`$${totals.avg.toFixed(2)}`}
            color="#fff8e1"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            icon={<Cancel color="error" />}
            title="Refunds"
            value={totals.refunds}
            color="#ffebee"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (This Week)
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={salesData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RTooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                  >
                    {paymentBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <FilterAlt color="primary" />
                <Typography variant="h6">Transaction History</Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Order</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((tx, idx) => (
                    <TableRow
                      key={tx.id}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                      }}
                    >
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>{tx.order}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>${tx.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {tx.method === "Cash" && (
                          <Chip
                            icon={<AttachMoney />}
                            label="Cash"
                            size="small"
                          />
                        )}
                        {tx.method === "Card" && (
                          <Chip
                            icon={<CreditCard />}
                            label="Card"
                            size="small"
                          />
                        )}
                        {tx.method === "Mobile" && (
                          <Chip
                            icon={<Smartphone />}
                            label="Mobile"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status}
                          color={
                            tx.status === "Paid"
                              ? "success"
                              : tx.status === "Refunded"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        No transactions match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function KpiCard({ icon, title, value, color }) {
  return (
    <Card sx={{ border: "1px solid #ddd", borderRadius: 2, background: color }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function CodeIconLike(props) {
  return (
    <Box
      component="span"
      sx={{
        width: 20,
        height: 20,
        border: "2px solid",
        borderColor: "text.secondary",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        color: "text.secondary",
      }}
      {...props}
    >
      {"{ }"}
    </Box>
  );
}
