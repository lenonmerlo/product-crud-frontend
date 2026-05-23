import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  getProduct,
} from "../services/products-service";
import { productSchema, type ProductInput } from "../lib/schemas";

interface Props {
  mode: "create" | "edit";
  productId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductFormScreen({
  mode,
  productId,
  onSuccess,
  onCancel,
}: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: true },
  });

  useEffect(() => {
    if (mode === "edit" && productId) {
      void loadProduct();
    }
  }, [mode, productId]);

  async function loadProduct() {
    try {
      const product = await getProduct(productId!);
      reset({
        codigoProduto: product.codigoProduto,
        descricaoProduto: product.descricaoProduto,
        status: product.status,
      });
      if (product.thumbnailUrl) setImageUri(product.thumbnailUrl);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o produto");
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function onSubmit(data: ProductInput) {
    try {
      setError(null);
      if (mode === "create") {
        const product = await createProduct(data);
        if (imageUri && !imageUri.startsWith("http")) {
          await uploadProductImage(product.id, imageUri);
        }
      } else if (productId) {
        await updateProduct(productId, data);
        if (imageUri && !imageUri.startsWith("http")) {
          await uploadProductImage(productId, imageUri);
        }
      }
      onSuccess();
    } catch {
      setError(
        mode === "create"
          ? "Erro ao cadastrar produto."
          : "Erro ao atualizar produto.",
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#3ea16f" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "create" ? "Novo produto" : "Editar produto"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <Text style={styles.fieldLabel}>
            Código do produto <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="codigoProduto"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.codigoProduto && styles.inputError,
                ]}
                placeholder="Ex: HNK-350"
                placeholderTextColor="#5f6f63"
                value={value}
                onChangeText={onChange}
                autoCapitalize="characters"
              />
            )}
          />
          {errors.codigoProduto && (
            <Text style={styles.errorText}>{errors.codigoProduto.message}</Text>
          )}

          <Text style={styles.fieldLabel}>
            Descrição <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="descricaoProduto"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.descricaoProduto && styles.inputError,
                ]}
                placeholder="Ex: Heineken Lata 350ml"
                placeholderTextColor="#5f6f63"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.descricaoProduto && (
            <Text style={styles.errorText}>
              {errors.descricaoProduto.message}
            </Text>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.fieldLabel}>Produto ativo</Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#2b4a35", true: "#3ea16f" }}
                  thumbColor="#fff"
                />
              )}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Foto do produto</Text>

          <View style={styles.imageRow}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>🍺</Text>
              </View>
            )}
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>
                  {imageUri ? "Trocar imagem" : "Escolher imagem"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.imageHint}>JPG, PNG ou WEBP. Opcional.</Text>
            </View>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? mode === "create"
                  ? "Cadastrando..."
                  : "Salvando..."
                : mode === "create"
                  ? "Cadastrar"
                  : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121910" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121910",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    paddingTop: 56,
    backgroundColor: "#18231a",
    borderBottomWidth: 1,
    borderBottomColor: "#2b4a35",
  },
  backButton: { padding: 4 },
  backButtonText: { color: "#3ea16f", fontSize: 14 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#e8efe9" },
  scroll: { padding: 16, gap: 16 },
  card: {
    backgroundColor: "#18231a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2b4a35",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#e8efe9",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#c8d4ca",
    marginBottom: 6,
  },
  required: { color: "#f97066" },
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  imageRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  imagePreview: { width: 80, height: 80, borderRadius: 12 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#1f2e22",
    borderWidth: 2,
    borderColor: "#2b4a35",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: { fontSize: 28 },
  imageActions: { flex: 1 },
  imageButton: {
    backgroundColor: "#3ea16f",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  imageButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  imageHint: { fontSize: 11, color: "#b7c2ba", marginTop: 6 },
  errorBox: {
    backgroundColor: "#2d1a1a",
    borderWidth: 1,
    borderColor: "#f97066",
    borderRadius: 12,
    padding: 12,
  },
  errorBoxText: { color: "#f97066", fontSize: 13 },
  buttons: { flexDirection: "row", gap: 12, marginBottom: 32 },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2b4a35",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  cancelButtonText: { color: "#3ea16f", fontWeight: "700", fontSize: 15 },
  submitButton: {
    flex: 1,
    backgroundColor: "#3ea16f",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
