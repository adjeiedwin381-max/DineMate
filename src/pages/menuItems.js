import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const categories = ["All", "Starters", "Mains", "Drinks", "Desserts"];

const sampleMenu = [
  {
    id: 1,
    name: "Cheeseburger",
    price: 12,
    category: "Mains",
    available: true,
    image: "https://source.unsplash.com/400x300/?burger",
    tags: ["Spicy", "Popular"],
  },
  {
    id: 2,
    name: "Caesar Salad",
    price: 8,
    category: "Starters",
    available: false,
    image: "https://source.unsplash.com/400x300/?salad",
    tags: ["Healthy", "Vegan"],
  },
  {
    id: 3,
    name: "Margarita Pizza",
    price: 15,
    category: "Mains",
    available: true,
    image: "https://source.unsplash.com/400x300/?pizza",
    tags: ["Chef’s Special"],
  },
];

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menu, setMenu] = useState(sampleMenu);

  const filteredMenu = menu.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for Categories */}
      <Box
        sx={{
          width: 220,
          borderRight: "1px solid #eee",
          p: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Categories
        </Typography>
        <List>
          {categories.map((cat) => (
            <ListItem key={cat} disablePadding>
              <ListItemButton
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                <ListItemText primary={cat} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            size="small"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{ width: 300 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, val) => val && setView(val)}
              size="small"
            >
              <ToggleButton value="grid">Grid</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Grid View */}
        {view === "grid" && (
          <Grid container spacing={3}>
            {filteredMenu.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ${item.price}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
                    >
                      {item.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          size="small"
                          label={tag}
                          color="primary"
                        />
                      ))}
                    </Box>
                    <Chip
                      size="small"
                      sx={{ mt: 1 }}
                      label={item.available ? "Available" : "Out of Stock"}
                      color={item.available ? "success" : "error"}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Table View */}
        {view === "table" && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMenu.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>
                    <Switch checked={item.available} />
                  </TableCell>
                  <TableCell>
                    {item.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Drawer for Adding Item */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add New Menu Item
          </Typography>
          <TextField label="Name" fullWidth size="small" sx={{ mb: 2 }} />
          <TextField label="Price" fullWidth size="small" sx={{ mb: 2 }} />
          <TextField label="Category" fullWidth size="small" sx={{ mb: 2 }} />
          <TextField
            label="Tags (comma separated)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => setDrawerOpen(false)}
          >
            Save Item
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
