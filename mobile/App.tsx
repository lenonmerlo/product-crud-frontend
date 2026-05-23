import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ProductsScreen } from "./src/screens/ProductsScreen";
import { ProductFormScreen } from "./src/screens/ProductFormScreen";

type Screen = "login" | "register" | "products" | "new-product" | "edit-product";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void checkAuth();
  }, []);

  async function checkAuth() {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) setScreen("products");
    setChecking(false);
  }

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: "#121910", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#3ea16f" size="large" />
      </View>
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onLogin={() => setScreen("products")}
        onGoToRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onLogin={() => setScreen("products")}
        onGoToLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "new-product") {
    return (
      <ProductFormScreen
        mode="create"
        onSuccess={() => setScreen("products")}
        onCancel={() => setScreen("products")}
      />
    );
  }

  if (screen === "edit-product" && editingId) {
    return (
      <ProductFormScreen
        mode="edit"
        productId={editingId}
        onSuccess={() => setScreen("products")}
        onCancel={() => setScreen("products")}
      />
    );
  }

  return (
    <ProductsScreen
      onNewProduct={() => setScreen("new-product")}
      onEditProduct={(id) => {
        setEditingId(id);
        setScreen("edit-product");
      }}
      onLogout={() => setScreen("login")}
    />
  );
}