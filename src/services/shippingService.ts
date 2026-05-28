import axios from "axios";

// Base API URL from environment configuration or default fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.bugyboo.com/api";

// Configured Axios instance for shipping requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Automatic JWT bearer token injection interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DTDCTrackingEvent {
  status: string;
  activity: string;
  location: string;
  timestamp: string;
}

export interface DTDCTrackingResponse {
  success: boolean;
  data: {
    awb: string;
    courier: string;
    status: string;
    expectedDelivery?: string;
    lastUpdated?: string;
    scans?: DTDCTrackingEvent[];
  };
}

export interface DTDCShipmentResponse {
  success: boolean;
  message?: string;
  data: {
    _id?: string;
    orderId: string;
    awbNumber: string;
    courier: string;
    shipmentStatus: string;
    labelUrl?: string;
  };
}

/**
 * Initiates DTDC shipment creation for an order.
 * POST /api/shipping/dtdc/create/:orderId
 */
export const createDTDCShipment = async (orderId: string): Promise<DTDCShipmentResponse> => {
  const response = await axiosInstance.post(`/shipping/dtdc/create/${orderId}`);
  return response.data;
};

/**
 * Fetches real-time tracking data for a shipment.
 * GET /api/shipping/dtdc/track/:awb
 */
export const trackDTDCShipment = async (awb: string): Promise<DTDCTrackingResponse> => {
  const response = await axiosInstance.get(`/shipping/dtdc/track/${awb}`);
  return response.data;
};

/**
 * Retrieves the download/print URL for a shipping label.
 * GET /api/shipping/dtdc/label/:awb
 */
export const generateDTDCLabel = async (
  awb: string
): Promise<{ success: boolean }> => {
  const response = await axiosInstance.get(
    `/shipping/dtdc/label/${awb}`,
    {
      responseType: "blob"
    }
  )

  const pdfBlob = new Blob(
    [response.data],
    {
      type: "application/pdf"
    }
  )

  const pdfUrl =
    window.URL.createObjectURL(pdfBlob)

  window.open(pdfUrl, "_blank")

  return {
    success: true
  }
};

/**
 * Cancels a generated shipment before dispatch.
 * POST /api/shipping/dtdc/cancel/:awb
 */
export const cancelDTDCShipment = async (awb: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post(`/shipping/dtdc/cancel/${awb}`);
  return response.data;
};
