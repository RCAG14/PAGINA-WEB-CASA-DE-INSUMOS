"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Box, CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
}

type CartAction =
  | { type: "HYDRATE"; lines: CartLine[] }
  | { type: "ADD"; box: Box; cantidad: number }
  | { type: "REMOVE"; boxId: string }
  | { type: "SET_QTY"; boxId: string; cantidad: number }
  | { type: "CLEAR" };

const STORAGE_KEY = "cdi-cart-v2";

const VALID_ICONS = new Set([
  "electronica",
  "joyeria",
  "hogar",
  "moda",
  "herramientas",
  "belleza",
  "juguetes",
  "mixto",
]);

function isValidCartLine(line: unknown): line is CartLine {
  if (typeof line !== "object" || line === null) return false;
  const l = line as Record<string, unknown>;
  return (
    typeof l.boxId === "string" &&
    typeof l.slug === "string" &&
    typeof l.nombre === "string" &&
    (l.tipo === "listada" || l.tipo === "sorpresa") &&
    typeof l.clasificacionLabel === "string" &&
    typeof l.clasificacionIcono === "string" &&
    VALID_ICONS.has(l.clasificacionIcono) &&
    typeof l.skuCaja === "string" &&
    typeof l.precio === "number" &&
    typeof l.cantidad === "number" &&
    typeof l.stock === "number"
  );
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { lines: action.lines, hydrated: true };
    case "ADD": {
      const existing = state.lines.find((l) => l.boxId === action.box.id);
      const maxQty = action.box.stock;
      if (existing) {
        const nextQty = Math.min(existing.cantidad + action.cantidad, maxQty);
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.boxId === action.box.id ? { ...l, cantidad: nextQty } : l
          ),
        };
      }
      const line: CartLine = {
        boxId: action.box.id,
        slug: action.box.slug,
        nombre: action.box.nombre,
        tipo: action.box.tipo,
        clasificacionLabel: action.box.clasificacion.label,
        clasificacionIcono: action.box.clasificacion.icon,
        skuCaja: action.box.specs.skuCaja,
        precio: action.box.precio,
        cantidad: Math.min(action.cantidad, maxQty),
        stock: maxQty,
      };
      return { ...state, lines: [...state.lines, line] };
    }
    case "REMOVE":
      return {
        ...state,
        lines: state.lines.filter((l) => l.boxId !== action.boxId),
      };
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.boxId === action.boxId
            ? { ...l, cantidad: Math.max(1, Math.min(action.cantidad, l.stock)) }
            : l
        ),
      };
    case "CLEAR":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  addBox: (box: Box, cantidad?: number) => void;
  removeLine: (boxId: string) => void;
  setQty: (boxId: string, cantidad: number) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const lines = Array.isArray(parsed) ? parsed.filter(isValidCartLine) : [];
      dispatch({ type: "HYDRATE", lines });
    } catch {
      dispatch({ type: "HYDRATE", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.hydrated]);

  const addBox = useCallback((box: Box, cantidad = 1) => {
    dispatch({ type: "ADD", box, cantidad });
  }, []);
  const removeLine = useCallback((boxId: string) => {
    dispatch({ type: "REMOVE", boxId });
  }, []);
  const setQty = useCallback((boxId: string, cantidad: number) => {
    dispatch({ type: "SET_QTY", boxId, cantidad });
  }, []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotal = useMemo(
    () => state.lines.reduce((acc, l) => acc + l.precio * l.cantidad, 0),
    [state.lines]
  );
  const totalItems = useMemo(
    () => state.lines.reduce((acc, l) => acc + l.cantidad, 0),
    [state.lines]
  );

  const value: CartContextValue = {
    lines: state.lines,
    hydrated: state.hydrated,
    addBox,
    removeLine,
    setQty,
    clear,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
