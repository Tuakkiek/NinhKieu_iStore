// frontend/src/components/cart/CartItemCard.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CartItemCard = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCartStore();

  const handleQuantityChange = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    updateCartItem({
      variantId: item.variantId,
      productType: item.productType,
      quantity: newQty,
    });
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  // XỬ LÝ ẢNH AN TOÀN
  const getImageUrl = () => {
    if (!item.image) return "/placeholder.png";
    if (item.image.startsWith("http")) return item.image;
    const cleanPath = item.image.startsWith("/") ? item.image : `/${item.image}`;
    return `${API_URL}${cleanPath}`;
  };

  // TỰ TẠO BIẾN THỂ – MỖI DÒNG RIÊNG
  const getVariantLines = () => {
    const lines = [];

    // 1. MÀU SẮC
    if (item.variantColor) lines.push(item.variantColor);

    // 2. THEO LOẠI SẢN PHẨM
    switch (item.productType) {
      case "iPhone":
      case "iPad":
        if (item.variantStorage) lines.push(item.variantStorage);
        if (item.variantConnectivity) lines.push(item.variantConnectivity);
        break;

      case "Mac":
        if (item.variantCpuGpu) lines.push(item.variantCpuGpu);
        if (item.variantRam) lines.push(`${item.variantRam} RAM`);
        if (item.variantStorage) lines.push(item.variantStorage);
        break;

      case "AirPods":
      case "AppleWatch":
      case "Accessory":
        if (item.variantName) lines.push(item.variantName);
        break;

      default:
        if (item.variantName) lines.push(item.variantName);
    }

    return lines.length > 0 ? lines : ["Phiên bản tiêu chuẩn"];
  };

  const variantLines = getVariantLines();

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow w-full">
      {/* Ảnh */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
        <img
          src={getImageUrl()}
          alt={item.productName}
          className="w-full h-full object-contain"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        {/* Tên sản phẩm */}
        <h4 className="font-semibold text-gray-900 line-clamp-2">
          {item.productName}
        </h4>

        {/* Model */}
        {item.productModel && (
          <p className="text-xs text-gray-500">{item.productModel}</p>
        )}

        {/* Biến thể – TỪNG DÒNG */}
        <div className="mt-1 space-y-0.5">
          {variantLines.map((line, index) => (
            <p key={index} className="text-sm text-gray-600 font-medium">
              {line}
            </p>
          ))}
        </div>

        {/* Đơn giá */}
        <p className="text-sm text-gray-600 mt-1">
          Đơn giá: {formatPrice(item.price)}
        </p>
      </div>

      {/* Số lượng + Tổng */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
          >
            Minus
          </Button>
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(1)}
          >
            Plus
          </Button>
        </div>
        <p className="font-bold text-red-600 text-lg">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Xóa */}
      <Button
        size="icon"
        variant="ghost"
        className="ml-2 text-red-600 hover:bg-red-50"
        onClick={handleRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CartItemCard;