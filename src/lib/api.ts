export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.bugyboo.com/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, any> | FormData;
  headers?: Record<string, string>;
};

const request = async <T>(path: string, options: RequestOptions): Promise<T> => {
  const isFormData = options.body instanceof FormData;
  const body = options.body
    ? isFormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "POST",
    headers: isFormData
      ? {
          ...(options.headers ?? {}),
        }
      : {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
    body: body as BodyInit | undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || "Request failed");
  }

  return data as T;
};

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    [key: string]: any;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    createdAt: string;
    [key: string]: any;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  createdAt?: string;
  __v?: number;
}

export interface AdminCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface AdminCategoryCreateResponse {
  success: boolean;
  data: Category;
}

export interface AdminProduct {
  _id?: string;
  id?: string;
  name: string;
  category: string | Category | null;
  color: string;
  size: string;
  description: string;
  basePrice: number;
  sellPrice: number;
  gst: number;
  images: string[];
  isPaused: boolean;
  status?: string;
  createdAt?: string;
  __v?: number;
}

export interface AdminProductsResponse {
  success: boolean;
  data: AdminProduct[];
}

export interface AdminProductCreateResponse {
  success: boolean;
  data: AdminProduct;
}

export interface AdminProductUpdateResponse {
  success: boolean;
  data: AdminProduct;
}

export interface AdminProductPauseResponse {
  success: boolean;
  data: AdminProduct;
}

export interface AdminProductDeleteResponse {
  success: boolean;
  message: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

export interface OrderProductItem {
  product: {
    _id?: string;
    name?: string;
    images?: string[];
  } | null;
  quantity: number;
  price: number;
  _id: string;
}

export interface OrderContact {
  _id: string;
  name: string;
  mobile: string;
  email: string;
}

export interface AdminOrder {
  _id: string;
  user: OrderUser;
  products: OrderProductItem[];
  totalAmount: number;
  contact: OrderContact;
  address: string | UserAddress | any;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  data: AdminOrder[];
}

export interface AdminOrderResponse {
  success: boolean;
  data: AdminOrder;
}

export interface AdminDashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalPayments: number;
  pendingOrders: number;
  pendingPayments: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

export interface AdminBlogCreatedBy {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface AdminBlog {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdBy: string | AdminBlogCreatedBy;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminBlogsResponse {
  success: boolean;
  blog: AdminBlog[];
}

export interface AdminBlogCreateResponse {
  success: boolean;
  blog: AdminBlog;
}

export interface AdminBlogUpdateResponse {
  success: boolean;
  blog: AdminBlog;
}

export interface AdminBlogDeleteResponse {
  success: boolean;
  blog: AdminBlog;
}

export const login = (identifier: string, password: string) =>
  request<LoginResponse>("/auth/login", {
    method: "POST",
    body: { identifier, password },
  });

export const signup = (name: string, email: string, mobile: string, password: string) =>
  request<SignupResponse>("/auth/signup", {
    method: "POST",
    body: { name, email, mobile, password },
  });

export const refreshToken = (refreshToken: string) =>
  request<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    body: { refreshToken },
  });

export const logout = (refreshToken: string) =>
  request<LogoutResponse>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });

export const createAdminCategory = (name: string, accessToken: string) =>
  request<AdminCategoryCreateResponse>("/admin/categories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: { name },
  });

export const getAdminCategories = (accessToken: string) =>
  request<AdminCategoriesResponse>("/admin/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const deleteAdminCategory = (categoryId: string, accessToken: string) =>
  request<LogoutResponse>(`/admin/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getAdminProducts = (accessToken: string) =>
  request<AdminProductsResponse>("/admin/products", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getAdminOrders = (accessToken: string) =>
  request<AdminOrdersResponse>("/admin/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getAdminPendingOrders = (accessToken: string) =>
  request<AdminOrdersResponse>("/admin/orders/pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const updateAdminOrderStatus = (orderId: string, status: string, accessToken: string) =>
  request<AdminOrderResponse>(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: { status },
  });

export const getAdminDashboard = (accessToken: string) =>
  request<AdminDashboardResponse>("/admin/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

const buildAdminBlogFormData = (blog: {
  title: string;
  description: string;
  isPublished: boolean;
  imageFile?: File | null;
}) => {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("description", blog.description);
  formData.append("isPublished", blog.isPublished ? "true" : "false");
  if (blog.imageFile) {
    formData.append("media", blog.imageFile);
  }
  return formData;
};

export const getAdminBlogs = (accessToken: string) =>
  request<AdminBlogsResponse>("/admin/blogs", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createAdminBlog = (
  blog: {
    title: string;
    description: string;
    isPublished: boolean;
    imageFile?: File | null;
  },
  accessToken: string,
) => {
  const body = blog.imageFile ? buildAdminBlogFormData(blog) : {
    title: blog.title,
    description: blog.description,
    isPublished: blog.isPublished,
  };

  return request<AdminBlogCreateResponse>("/admin/blogs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
};

export const updateAdminBlog = (
  blogId: string,
  blog: Partial<{
    title: string;
    description: string;
    isPublished: boolean;
    imageFile?: File | null;
  }>,
  accessToken: string,
) => {
  const body = blog.imageFile ? buildAdminBlogFormData(blog as any) : blog;
  return request<AdminBlogUpdateResponse>(`/admin/blogs/${blogId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
};

export const deleteAdminBlog = (blogId: string, accessToken: string) =>
  request<AdminBlogDeleteResponse>(`/admin/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

const buildAdminProductFormData = (
  product: {
    name: string;
    category: string | Category | null;
    color: string;
    size: string;
    description: string;
    basePrice: number;
    sellPrice: number;
    gst: number;
    isPaused: boolean;
    imageFiles?: File[];
  },
  fileField = "media",
) => {
  const categoryId = typeof product.category === "string"
    ? product.category
    : product.category
      ? product.category._id ?? product.category.id ?? ""
      : "";

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("category", categoryId);
  formData.append("color", product.color);
  formData.append("size", product.size);
  formData.append("description", product.description);
  formData.append("basePrice", product.basePrice.toString());
  formData.append("sellPrice", product.sellPrice.toString());
  formData.append("gst", product.gst.toString());
  formData.append("isPaused", product.isPaused ? "true" : "false");
  if (product.imageFiles && product.imageFiles.length > 0) {
    product.imageFiles.forEach((file) => {
      formData.append(fileField, file);
    });
  }
  return formData;
};

export const createAdminProduct = (
  product: Omit<AdminProduct, "_id" | "id" | "createdAt" | "__v" | "images"> & { imageFiles?: File[] },
  accessToken: string,
) => {
  const body = product.imageFiles && product.imageFiles.length > 0 ? buildAdminProductFormData(product) : {
    ...product,
    images: [],
  };

  return request<AdminProductCreateResponse>("/admin/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
};

export const updateAdminProduct = (
  productId: string,
  product: Partial<Omit<AdminProduct, "_id" | "id" | "createdAt" | "__v" | "images">> & { imageFiles?: File[] },
  accessToken: string,
) => {
  const body = product.imageFiles && product.imageFiles.length > 0 ? buildAdminProductFormData(product as any, "images") : product;
  return request<AdminProductUpdateResponse>(`/admin/products/${productId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
};

export const pauseAdminProduct = (productId: string, accessToken: string) =>
  request<AdminProductPauseResponse>(`/admin/products/${productId}/pause`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const deleteAdminProduct = (productId: string, accessToken: string) =>
  request<AdminProductDeleteResponse>(`/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

// User APIs
export interface UserDashboardData {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalCartItems: number;
}

export interface UserDashboardResponse {
  success: boolean;
  data: UserDashboardData;
}

export interface CartProduct {
  productId: string;
  quantity: number;
  _id: string;
}

export interface UserCart {
  _id: string;
  userId: string;
  products: CartProduct[];
  createdAt: string;
  __v: number;
}

export interface UserCartResponse {
  success: boolean;
  data: UserCart;
}

export interface UserOrder {
  _id: string;
  user: string;
  products: Array<{
    product: any; // You can define a more specific type if needed
    quantity: number;
    price: number;
    _id: string;
  }>;
  totalAmount: number;
  contact: {
    name: string;
    mobile: string;
    email: string;
    _id: string;
  };
  address: string | UserAddress | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserOrdersResponse {
  success: boolean;
  data: UserOrder[];
}

export interface UserOrderResponse {
  success: boolean;
  data: UserOrder;
}

export interface UserAddress {
  _id: string;
  userId: string;
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
  createdAt: string;
  __v: number;
}

export interface UserAddressesResponse {
  success: boolean;
  data: UserAddress[];
}

export interface UserAddressResponse {
  success: boolean;
  data: UserAddress;
}

export interface CreateUserAddressRequest {
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
}

export interface UpdateUserAddressRequest {
  fullAddress?: string;
  city?: string;
  pincode?: string;
  country?: string;
}

export const getUserDashboard = (accessToken: string) =>
  request<UserDashboardResponse>("/user/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUserCart = (accessToken: string) =>
  request<UserCartResponse>("/cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const addToCart = (productId: string, quantity: number, accessToken: string) =>
  request<UserCartResponse>("/cart/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: { productId, quantity },
  });

export const updateCart = (productId: string, quantity: number, accessToken: string) =>
  request<UserCartResponse>("/cart/update", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: { productId, quantity },
  });

export const removeFromCart = (productId: string, accessToken: string) =>
  request<UserCartResponse>(`/cart/remove/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUserOrders = (accessToken: string) =>
  request<UserOrdersResponse>("/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUserOrder = (orderId: string, accessToken: string) =>
  request<UserOrderResponse>(`/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getUserAddresses = (accessToken: string) =>
  request<UserAddressesResponse>("/address", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createUserAddress = (address: CreateUserAddressRequest, accessToken: string) =>
  request<UserAddressResponse>("/address", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: address,
  });

export const updateUserAddress = (addressId: string, address: UpdateUserAddressRequest, accessToken: string) =>
  request<UserAddressResponse>(`/address/${addressId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: address,
  });

export const deleteUserAddress = (addressId: string, accessToken: string) =>
  request<UserAddressResponse>(`/address/${addressId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export interface CreateOrderRequest {
  contact: {
    name: string;
    mobile: string;
    email: string;
  };
  addressId: string;
  paymentMethod: string;
  paymentStatus?: string;
  transactionId?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: UserOrder;
}

export const createOrder = (order: CreateOrderRequest, accessToken: string) =>
  request<CreateOrderResponse>("/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: order,
  });

// Public Blog APIs (no auth required)
export interface PublicBlog {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PublicBlogsResponse {
  success: boolean;
  blog: PublicBlog[];
}

export interface PublicBlogResponse {
  success: boolean;
  blog: PublicBlog;
}

export const getBlogs = () =>
  request<PublicBlogsResponse>("/blogs", {
    method: "GET",
  });

export const getBlogById = (blogId: string) =>
  request<PublicBlogResponse>(`/blogs/${blogId}`, {
    method: "GET",
  });

// Public Product APIs (no auth required)
export interface PublicProduct {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  color: string;
  size: string;
  description: string;
  basePrice: number;
  sellPrice: number;
  gst: number;
  images: string[];
  isPaused: boolean;
  createdAt: string;
  __v: number;
}

export interface PublicProductsResponse {
  success: boolean;
  data: PublicProduct[];
}

export interface PublicProductResponse {
  success: boolean;
  data: PublicProduct;
}

export const getProducts = () =>
  request<PublicProductsResponse>("/products", {
    method: "GET",
  });

export const getProductById = (productId: string) =>
  request<PublicProductResponse>(`/products/${productId}`, {
    method: "GET",
  });

export const searchProducts = (query: string) =>
  request<PublicProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });

