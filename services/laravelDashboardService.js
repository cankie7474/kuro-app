import { apiRequest } from "./laravelApi";

const laravelDashboardService = {
  async getDashboard() {
    return await apiRequest("/api/dashboard");
  },
};

export default laravelDashboardService;
