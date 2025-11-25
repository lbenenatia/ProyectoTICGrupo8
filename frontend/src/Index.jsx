import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import "./styles/tailwind.css";
import "./styles/index.css";
import { ToastProvider } from "context/ToastContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<AuthProvider>
		<CartProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</CartProvider>
	</AuthProvider>
);
