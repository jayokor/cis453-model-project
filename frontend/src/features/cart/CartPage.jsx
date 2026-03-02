import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { useNavigate } from "react-router-dom";
import { money } from "../../utils/format";
import { fetchCart, updateCartItem, removeCartItem, clearCart, createOrder } from "../../api/index";

export default function CartPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  const updateMut = useMutation({
    mutationFn: ({ menuItemId, quantity }) => updateCartItem(menuItemId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMut = useMutation({
    mutationFn: (menuItemId) => removeCartItem(menuItemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearMut = useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const checkoutMut = useMutation({
  mutationFn: createOrder,
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ["cart"] });
    await qc.invalidateQueries({ queryKey: ["orders"] });
    navigate("/orders");
  },
  });

  if (cartQuery.isLoading) return <Loading label="Loading cart..." />;
  if (cartQuery.isError) return <ErrorState error={cartQuery.error} />;

  const raw = cartQuery.data;
  const items =
    raw?.items ??
    raw?.cart?.items ??
    raw?.cartItems ??
    [];

    const subtotalCents = raw?.totals?.subtotal_cents ?? 0;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Cart</h2>

      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => {
              const menuItemId = it.menu_item_id;
              const name = it.name;
              const priceCents = it.price_cents;
              const qty = it.quantity;

              return (
                <div
                  key={menuItemId}
                  style={{
                    border: "1px solid #333",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{name}</div>
                    <div style={{ opacity: 0.8 }}>{money(priceCents)}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() =>
                        updateMut.mutate({
                          menuItemId,
                          quantity: Math.max(1, Number(qty) - 1),
                        })
                      }
                      disabled={updateMut.isPending}
                      style={{ padding: "6px 10px" }}
                    >
                      -
                    </button>

                    <div style={{ minWidth: 28, textAlign: "center" }}>{qty}</div>

                    <button
                      onClick={() =>
                        updateMut.mutate({
                          menuItemId,
                          quantity: Number(qty) + 1,
                        })
                      }
                      disabled={updateMut.isPending}
                      style={{ padding: "6px 10px" }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeMut.mutate(menuItemId)}
                      disabled={removeMut.isPending}
                      style={{ padding: "6px 10px", marginLeft: 8 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <div style={{ opacity: 0.85 }}>Subtotal</div>
            <div style={{ fontWeight: 700 }}>{money(subtotalCents)}</div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              onClick={() => clearMut.mutate()}
              disabled={clearMut.isPending}
              style={{ padding: "8px 12px" }}
            >
              Clear cart
            </button>

            <button
            onClick={() => checkoutMut.mutate()}
            disabled={items.length === 0 || checkoutMut.isPending}
            style={{ padding: "8px 12px" }}
            >
            {checkoutMut.isPending ? "Placing order..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}