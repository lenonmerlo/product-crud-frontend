import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchProducts, deleteProduct } from "../services/products-service";
import type { Product, PaginatedProducts } from "../lib/types";

interface Props {
  onNewProduct: () => void;
  onEditProduct: (id: string) => void;
  onLogout: () => void;
}

export function ProductsScreen({ onNewProduct, onEditProduct, onLogout }: Props) {
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    const stored = await SecureStore.getItemAsync("user");
    if (stored) {
      const user = JSON.parse(stored) as { name: string };
      setUserName(user.name.split(" ")[0]);
    }
  }

  const loadProducts = useCallback(async () => {
    try {
      const result = await fetchProducts(page, 20);
      setData(result);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os produtos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function handleDelete(id: string) {
    Alert.alert("Excluir produto", "Confirma exclusão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            await loadProducts();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o produto");
          }
        },
      },
    ]);
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    onLogout();
  }

  const filtered = data?.data.filter(
    (p) =>
      p.descricaoProduto.toLowerCase().includes(search.toLowerCase()) ||
      p.codigoProduto.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  function renderProduct({ item }: { item: Product }) {
    return (
      <View style={[styles.card, !item.status && styles.cardInactive]}>
        <View style={styles.cardImage}>
          {item.thumbnailUrl ? (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.imagePlaceholder}>🍺</Text>
          )}
          <View style={[styles.badge, !item.status && styles.badgeInactive]}>
            <Text style={styles.badgeText}>
              {item.status ? "Ativo" : "Inativo"}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.code}>{item.codigoProduto}</Text>
          <Text style={styles.name} numberOfLines={2}>{item.descricaoProduto}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEditProduct(item.id)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>PAINEL COMERCIAL</Text>
          <Text style={styles.headerTitle}>
            {userName ? `Olá, ${userName} 👋` : "Lippaus"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.newButton} onPress={onNewProduct}>
            <Text style={styles.newButtonText}>+ Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor="#5f6f63"
          value={search}
          onChangeText={setSearch}
        />
        {data && (
          <Text style={styles.count}>{data.meta.total} produtos</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#3ea16f" size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void loadProducts();
              }}
              tintColor="#3ea16f"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍺</Text>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121910" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 56,
    backgroundColor: "#18231a",
    borderBottomWidth: 1,
    borderBottomColor: "#2b4a35",
  },
  headerLabel: { fontSize: 10, color: "#3ea16f", letterSpacing: 2 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#e8efe9" },
  headerActions: { flexDirection: "row", gap: 8 },
  newButton: {
    backgroundColor: "#3ea16f",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#2b4a35",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutButtonText: { color: "#b7c2ba", fontSize: 13 },
  searchContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#18231a",
    borderWidth: 1,
    borderColor: "#2b4a35",
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    color: "#e8efe9",
  },
  count: { fontSize: 12, color: "#b7c2ba" },
  loader: { flex: 1 },
  list: { padding: 8 },
  row: { gap: 8, paddingHorizontal: 8, marginBottom: 8 },
  card: {
    flex: 1,
    backgroundColor: "#18231a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2b4a35",
    overflow: "hidden",
  },
  cardInactive: { opacity: 0.6 },
  cardImage: {
    height: 120,
    backgroundColor: "#1f2e22",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { fontSize: 36 },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#3ea16f",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeInactive: { backgroundColor: "#4a4a4a" },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 10 },
  code: { fontSize: 10, color: "#b7c2ba", fontFamily: "monospace" },
  name: { fontSize: 13, fontWeight: "600", color: "#e8efe9", marginTop: 2 },
  actions: { flexDirection: "row", gap: 6, marginTop: 10 },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2b4a35",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
  },
  editButtonText: { color: "#3ea16f", fontSize: 12, fontWeight: "600" },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#3d1a1a",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  deleteButtonText: { color: "#f97066", fontSize: 12, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: "#b7c2ba", fontSize: 14 },
});