// components/Sidebar.tsx
import { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { MdPerson, MdInventory2, MdStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 72;

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDrawer, setOpenDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: <MdPerson />, label: "Perfil", href: "/PerfilComercio" },
    { icon: < MdInventory2 />, label: "Estoque", href: "/EditorProdutos" },
    { icon: < MdStorefront />, label: "Comercio", href: "/mercadao" },
  ];

  const filteredNavItems = navItems.filter((item) => true);

  const drawerContent = (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        bgcolor: "rgba(7, 111, 214, 0.8)",
        height: "100%",
        color: "#fff",
        transition: "width 0.3s",
        overflowX: "hidden",
        fontFamily: "'Orbitron', sans-serif",
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        {!isMobile && (
          <IconButton onClick={toggleCollapse} sx={{ color: "#fff" }}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

     <Box
  sx={{
    mt: isMobile ? '64px' : 0,
  }}
>
  <List>
    {filteredNavItems.map((item) => (
      <Tooltip
        key={item.label}
        title={collapsed && !isMobile ? item.label : ""}
        placement="right"
      >
        <ListItemButton
          onClick={() => navigate(item.href)}
          sx={{
            justifyContent: collapsed && !isMobile ? "center" : "flex-start",
            px: 2,
            py: 1,
            "&:hover": {
              backgroundColor: "#ffeb3b",
              color: "#000",
            },
          }}
        >
          <ListItemIcon
            sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2 }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && <ListItemText primary={item.label} />}
        </ListItemButton>
      </Tooltip>
    ))}
  </List>
</Box>

    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#003366" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "rgba(7, 111, 214, 0.7)",
          backdropFilter: "blur(8px)",
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                edge="start"
                sx={{ color: "#fff" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <img src="#" alt="manaus conectada" style={{ height: 45 }} />
          </Box>
          <Box>
            <MdPerson />
          </Box>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: collapsed ? collapsedWidth : drawerWidth,
            flexShrink: 0,
            transition: "width 0.3s",
          }}
        >
          {drawerContent}
        </Box>
      )}

      {isMobile && (
        <Drawer open={openDrawer} onClose={toggleDrawer}>
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isMobile ? "80px" : "64px", // <-- Aqui adiciona espaço extra no mobile
          px: 2,
          ml: isMobile ? 0 : collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
          mb: isMobile ? "80px" : 0,
          transition: "margin 0.3s",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "600px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
