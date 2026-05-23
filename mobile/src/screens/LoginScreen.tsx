import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import api from "../lib/api";
import { loginSchema, type LoginInput } from "../lib/schemas";
import type { AuthResponse } from "../lib/types";

interface Props {
  onLogin: () => void;
  onGoToRegister: () => void;
}

export function LoginScreen({ onLogin, onGoToRegister }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      setError(null);
      const response = await api.post<AuthResponse>("/auth/login", data);
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
      onLogin();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === "string") {
          setError(message);
          return;
        }
      }
      setError("E-mail ou senha inválidos");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.brand}>Lippaus</Text>
          <Text style={styles.subtitle}>Painel Comercial</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>ACESSO</Text>
          <Text style={styles.title}>Entrar na conta</Text>
          <Text style={styles.description}>Use suas credenciais de trabalho.</Text>

          <Text style={styles.fieldLabel}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor="#5f6f63"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Text style={styles.fieldLabel}>Senha</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Sua senha"
                placeholderTextColor="#5f6f63"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToRegister} style={styles.linkButton}>
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkBold}>Criar conta</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121910" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 32 },
  brand: { fontSize: 32, fontWeight: "700", color: "#e8efe9" },
  subtitle: { fontSize: 13, color: "#b7c2ba", marginTop: 4, letterSpacing: 2 },
  card: {
    backgroundColor: "#18231a",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2b4a35",
  },
  label: { fontSize: 10, color: "#3ea16f", letterSpacing: 3, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: "700", color: "#e8efe9", marginBottom: 4 },
  description: { fontSize: 13, color: "#b7c2ba", marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: "500", color: "#c8d4ca", marginBottom: 6 },
  input: {
    backgroundColor: "#1f2e22",
    borderWidth: 1,
    borderColor: "#2b4a35",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#e8efe9",
    marginBottom: 4,
  },
  inputError: { borderColor: "#f97066" },
  errorText: { fontSize: 12, color: "#f97066", marginBottom: 8 },
  errorBox: {
    backgroundColor: "#2d1a1a",
    borderWidth: 1,
    borderColor: "#f97066",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorBoxText: { color: "#f97066", fontSize: 13 },
  button: {
    backgroundColor: "#3ea16f",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  linkButton: { marginTop: 20, alignItems: "center" },
  linkText: { fontSize: 13, color: "#b7c2ba" },
  linkBold: { fontWeight: "700", color: "#3ea16f" },
});