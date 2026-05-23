export interface Product {
    id: string;
    codigoProduto: string;
    status: boolean;
    fotoProduto: string | null;
    thumbnaiUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedProducts {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}