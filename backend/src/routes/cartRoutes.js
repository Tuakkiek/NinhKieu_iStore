// routes/cartRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Chỉ cần protect
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
} from "../controllers/cartController.js";

const router = express.Router();

// === BẢO VỆ: Chỉ user đã đăng nhập (Customer hoặc Admin) ===
router.use(protect);

// === TẤT CẢ NGƯỜI DÙNG DÙNG CÙNG ROUTE ===
// → Giỏ hàng luôn thuộc về req.user._id → an toàn 100%
router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/items/:itemId", removeFromCart);
router.delete("/", clearCart);
router.post("/validate", validateCart);

export default router;