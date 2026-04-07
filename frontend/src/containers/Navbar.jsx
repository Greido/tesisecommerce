import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Badge
} from "@mui/material";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "About Us", path: "/about" },
    { text: "Sacar Turno", path: "/turnos" },
    { text: "Perfil", path: "/perfil" }
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#0f0f0f" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* LOGO */}
          <Box
            component="img"
            src={logo}
            alt="AnimalZoo"
            sx={{ height: 40, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

          {/* SEARCH DESKTOP */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: "#1c1c1c",
              px: 2,
              py: 0.5,
              borderRadius: 2
            }}
          >
            <SearchIcon sx={{ color: "gray", mr: 1 }} />
            <InputBase
              placeholder="Buscar productos..."
              sx={{ color: "white" }}
            />
          </Box>

          {/* MENU DESKTOP */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button color="inherit" onClick={() => navigate("/about")}>
              About Us
            </Button>
            <Button color="inherit" onClick={() => navigate("/turnos")}>
              Sacar Turno
            </Button>
            <IconButton color="inherit" onClick={() => navigate("/perfil")}>
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={2} color="success">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER MOBILE */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: "#0f0f0f",
            height: "100%",
            color: "white"
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button>
              <ListItemText primary="Carrito" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}