// FILE: src/store/cartStore.js
// FIXED: addToCart & updateCartItem now require productType
// FIXED: 400 Bad Request from missing productType
import { create } from "zustand";
import { cartAPI } from "@/lib/api";

export const useCartStore = create((set, get) => ({
  cart: { items: [] },
  isLoading: false,
  error: null,

  // Get cart
  getCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.getCart();
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  // FIXED: addToCart nhận { variantId, productType, quantity }
  addToCart: async ({ variantId, productType, quantity = 1 }) => {
    set({ isLoading: true, error: null });
    try {
      // GỬI ĐỦ 3 TRƯỜNG: variantId, productType, quantity
      const response = await cartAPI.addToCart({
        variantId,
        productType, // BẮT BUỘC – backend yêu cầu
        quantity,
      });
      set({ cart: response.data.data, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Thêm vào giỏ hàng thất bại";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // FIXED: updateCartItem nhận { variantId, productType, quantity }
  updateCartItem: async ({ variantId, productType, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.updateItem({
        variantId,
        productType, // BẮT BUỘC
        quantity,
      });
      set({ cart: response.data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Cập nhật giỏ hàng thất bại";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // removeFromCart: chỉ cần itemId (subdocument _id), không cần productType
  removeFromCart: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.removeItem(itemId);
      set({ cart: response.data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Xóa sản phẩm thất bại";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear cart
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartAPI.clearCart();
      set({ cart: { items: [] }, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Xóa giỏ hàng thất bại";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // getTotal - DÙNG variant.price
  getTotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // Get item count
  getItemCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },

  // Get item by variantId
  getItemByVariant: (variantId) => {
    const { cart } = get();
    return cart.items.find(item => item.variantId === variantId);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));