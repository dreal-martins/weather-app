import axios from "axios";

interface IMethod {
  method: "get" | "put" | "delete" | "post";
}

const apiService = async (
  url: string,
  method: IMethod["method"],
  requestData?: any,
  headers: any = {
    "Content-Type": "application/json",
  },
  params?: any,
  baseURL: string = process.env.REACT_APP_BASE_URL || "",
  responseType: "json" | "blob" = "json"
) => {
  try {
    const { data } = await axios({
      method,
      url,
      data: requestData,
      baseURL,
      headers,
      params,
      responseType,
    });
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export default apiService;
