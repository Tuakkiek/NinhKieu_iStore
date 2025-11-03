// frontend/src/pages/customer/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // THÊM IMPORT
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import CartItemCard from "@/components/cart/CartItemCard";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { cart, getCart, getTotal, getItemCount, clearCart, isLoading, error } = useCartStore();

  // STATE: Danh sách item được chọn
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    if (isAuthenticated && user?.role === "CUSTOMER") {
      getCart();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user, getCart, navigate]);

  useEffect(() => {
    // Mặc định chọn tất cả khi load
    if (cart?.items) {
      const allIds = new Set(cart.items.map(item => item._id));
      setSelectedItems(allIds);
    }
  }, [cart]);

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }
    navigate("/checkout", { state: { selectedItems: Array.from(selectedItems) } });
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const toggleItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item._id)));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  const items = cart?.items || [];
  const total = getTotal();
  const itemCount = getItemCount();

  // TÍNH TIỀN CHỌN LỌC
  const selectedTotal = items
    .filter(item => selectedItems.has(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedCount = selectedItems.size;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleContinueShopping}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <div className="flex items-center gap-2 ml-auto">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">{itemCount} sản phẩm</span>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào.</p>
            <Button onClick={handleContinueShopping} size="lg">
              Tiếp tục mua sắm
            </Button>
          </Card>
        ) : (
          <>
            {/* CHỌN TẤT CẢ */}
            <div className="flex items-center gap-3 mb-4">
              <Checkbox
                checked={selectedItems.size === items.length && items.length > 0}
                onCheckedChange={toggleAll}
                className="rounded-full"
              />
              <label className="text-sm font-medium cursor-pointer" onClick={toggleAll}>
                Chọn tất cả ({items.length})
              </label>
            </div>

            {/* 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CỘT 1: DANH SÁCH */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedItems.has(item._id)}
                      onCheckedChange={() => toggleItem(item._id)}
                      className="mt-6 rounded-full"
                    />
                    <div className="flex-1">
                      <CartItemCard item={item} />
                    </div>
                  </div>
                ))}
              </div>

              {/* CỘT 2: THANH TOÁN */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tạm tính ({selectedCount} sản phẩm)
                      </span>
                      <span className="font-medium">{formatPrice(selectedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium">Miễn phí</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Tổng cộng</span>
                        <span className="text-2xl font-bold text-red-600">
                          {formatPrice(selectedTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleCheckout}
                      disabled={selectedCount === 0}
                    >
                      Thanh toán ({selectedCount})
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={clearCart}
                    >
                      Xóa tất cả
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;