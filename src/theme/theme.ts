import { createTheme } from "@mui/material/styles";
import { color, font, radius, shadow, transition } from "./tokens";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: color.brand.primary,
      light: "#93b34e",
      dark: color.brand.primaryHover,
      contrastText: color.text.onBrand,
    },
    secondary: {
      main: "#6B8E23",
      light: "#8FA887",
      dark: "#5A7519",
      contrastText: "#ffffff",
    },
    error: {
      main: color.status.error,
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: color.status.warning,
      light: "#fbbf24",
      dark: "#d97706",
    },
    success: {
      main: color.status.success,
      light: "#93b34e",
      dark: color.brand.primaryHover,
    },
    info: {
      main: color.status.info,
      light: "#a5b4fc",
      dark: "#4f46e5",
    },
    background: {
      default: color.bg.app,
      paper: color.bg.overlay,
    },
    text: {
      primary: color.text.primary,
      secondary: color.text.secondary,
      disabled: color.text.disabled,
    },
    divider: color.border.base,
  },

  typography: {
    fontFamily: font.family.sans,
    h1: {
      fontWeight: font.weight.bold,
      fontSize: font.size["4xl"],
      lineHeight: 1.25,
    },
    h2: {
      fontWeight: font.weight.bold,
      fontSize: font.size["3xl"],
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: font.weight.semibold,
      fontSize: font.size["2xl"],
      lineHeight: 1.375,
    },
    h4: {
      fontWeight: font.weight.semibold,
      fontSize: font.size.xl,
      lineHeight: 1.375,
    },
    h5: { fontWeight: font.weight.semibold, fontSize: font.size.lg },
    h6: { fontWeight: font.weight.semibold, fontSize: font.size.base },
    subtitle1: {
      fontSize: font.size.base,
      fontWeight: font.weight.medium,
      color: color.text.secondary,
    },
    subtitle2: {
      fontSize: font.size.sm,
      fontWeight: font.weight.medium,
      color: color.text.secondary,
    },
    body1: { fontSize: font.size.base, lineHeight: 1.5 },
    body2: {
      fontSize: font.size.sm,
      lineHeight: 1.5,
      color: color.text.secondary,
    },
    caption: { fontSize: font.size.xs, color: color.text.tertiary },
    overline: {
      fontSize: font.size["2xs"],
      fontWeight: font.weight.semibold,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: color.text.tertiary,
    },
    button: {
      textTransform: "none",
      fontWeight: font.weight.semibold,
      fontSize: font.size.sm,
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    "none",
    shadow.sm,
    shadow.base,
    shadow.md,
    shadow.md,
    shadow.lg,
    shadow.lg,
    shadow.xl,
    shadow.xl,
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
    shadow["2xl"],
  ],

  components: {
    MuiTextField: {
      defaultProps: { variant: "standard" },
      styleOverrides: {
        root: {
          "& .MuiInput-underline:before": {
            borderBottomColor: color.border.base,
            borderBottomWidth: "1px",
          },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: color.brand.primary,
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: color.brand.primary,
          },
          "& .MuiInputBase-input::placeholder": {
            color: color.text.tertiary,
            opacity: 1,
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.button,
          padding: "10px 24px",
          fontSize: font.size.sm,
          fontWeight: font.weight.semibold,
          transition: transition.base,
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: shadow.brand },
        },
        outlined: {
          borderColor: color.border.base,
          "&:hover": {
            borderColor: color.brand.primary,
            background: color.bg.selected,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: transition.base,
          "&:hover": { background: color.bg.hover },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: color.bg.elevated,
          border: `1px solid ${color.border.base}`,
          borderRadius: radius.card,
          transition: `transform ${transition.duration.base}, box-shadow ${transition.duration.base}`,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: shadow.brand,
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px 24px",
          "&:last-child": { paddingBottom: "20px" },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: color.bg.overlay,
          border: `1px solid ${color.border.base}`,
        },
        elevation1: { boxShadow: shadow.base },
        elevation2: { boxShadow: shadow.md },
        elevation3: { boxShadow: shadow.lg },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: color.bg.overlay,
          border: `1px solid ${color.border.base}`,
          borderRadius: radius.dialog,
          backgroundImage: "none",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: font.size.xl,
          fontWeight: font.weight.bold,
          color: color.text.primary,
          padding: "20px 24px 16px",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: { padding: "0 24px 20px" },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: color.bg.overlay,
          borderRight: `1px solid ${color.border.base}`,
          width: 280,
          backgroundImage: "none",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderLeft: "3px solid transparent",
          transition: transition.base,
          "&:hover": {
            backgroundColor: color.bg.selected,
            borderLeftColor: color.brand.primary,
          },
          "&.Mui-selected": {
            backgroundColor: color.bg.selected,
            borderLeftColor: color.brand.primary,
            "&:hover": { backgroundColor: "rgba(133, 164, 70,0.2)" },
          },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: color.bg.subtle,
            color: color.text.secondary,
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: color.bg.hover },
          "&:last-child td": { border: 0 },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${color.border.subtle}`,
          fontSize: font.size.sm,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: color.brand.primaryMuted,
          color: color.brand.primary,
          border: `1px solid ${color.brand.primaryBorder}`,
          fontWeight: font.weight.semibold,
          fontSize: font.size.xs,
          borderRadius: radius.badge,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: color.status.error,
          color: "#ffffff",
          fontWeight: font.weight.bold,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: color.bg.subtle,
          color: color.text.primary,
          fontSize: font.size.xs,
          border: `1px solid ${color.border.base}`,
          borderRadius: radius.base,
        },
        arrow: { color: color.bg.subtle },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: color.border.base },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.input,
          "& fieldset": { borderColor: color.border.base },
          "&:hover fieldset": { borderColor: color.border.strong },
          "&.Mui-focused fieldset": { borderColor: color.brand.primary },
        },
        input: { color: color.text.primary, fontSize: font.size.sm },
      },
    },

    MuiSelect: {
      styleOverrides: {
        icon: { color: color.text.tertiary },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: color.bg.overlay,
          border: `1px solid ${color.border.base}`,
          borderRadius: radius.lg,
          backgroundImage: "none",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: font.size.sm,
          "&:hover": { backgroundColor: color.bg.hover },
          "&.Mui-selected": { backgroundColor: color.bg.selected },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: font.size.sm,
          fontWeight: font.weight.medium,
          textTransform: "none",
          color: color.text.tertiary,
          "&.Mui-selected": { color: color.brand.primary },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: color.brand.primary, height: 2 },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: color.bg.subtle, borderRadius: radius.full },
        bar: {
          backgroundColor: color.brand.primary,
          borderRadius: radius.full,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: { color: color.brand.primary },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": { color: color.brand.primary },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: color.brand.primary,
          },
        },
        track: { backgroundColor: color.border.strong },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: color.border.strong,
          "&.Mui-checked": { color: color.brand.primary },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: color.border.strong,
          "&.Mui-checked": { color: color.brand.primary },
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: color.border.strong,
          "&.Mui-active": { color: color.brand.primary },
          "&.Mui-completed": { color: color.status.paid },
        },
        text: { fill: color.text.primary },
      },
    },

    MuiStepConnector: {
      styleOverrides: {
        line: { borderColor: color.border.base },
      },
    },
  },
});
