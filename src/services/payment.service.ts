import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class PaymentService {
  async createMercadoPagoPreference(items: any[], orderId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/payments/create-preference`,
        { items, orderId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error('Error creating payment preference:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/payments/status/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
}

export default new PaymentService();
