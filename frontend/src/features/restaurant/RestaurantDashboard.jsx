import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { money } from "../../utils/format";
import { fetchRestaurantOrders, fetchRestaurantOrderById, updateRestaurantOrderStatus } from "../../api/index";

const STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default function RestaurantDashboard() {
  const qc = useQueryClient();
  const [openOrderId, setOpenOrderId] = useState(null);

  const ordersQ = useQuery({
    queryKey: ["restaurantOrders"],
    queryFn: fetchRestaurantOrders,
  });

  const selectedOrderQ = useQuery({
    queryKey: ["restaurantOrder", openOrderId],
    queryFn: () => fetchRestaurantOrderById(openOrderId),
    enabled: !!openOrderId,
  });

  const updateStatusM = useMutation({
    mutationFn: ({ orderId, status }) => updateRestaurantOrderStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurantOrders"] });
      if (openOrderId) qc.invalidateQueries({ queryKey: ["restaurantOrder", openOrderId] });
    },
  });

  const orders = useMemo(() => ordersQ.data?.orders ?? [], [ordersQ.data]);

  if (ordersQ.isLoading) return <Loading />;
  if (ordersQ.isError) return <ErrorState error={ordersQ.error} />;

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Restaurant Dashboard</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        Manage incoming orders for your restaurant.
      </div>

      {orders.length === 0 ? (
        <div style={{ opacity: 0.8 }}>No orders yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => {
            const isOpen = openOrderId === o.id;
            return (
              <div
                key={o.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: 16,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      Order #{o.id} <span style={{ opacity: 0.75 }}>({o.status})</span>
                    </div>
                    <div style={{ opacity: 0.85 }}>
                      Total: {money(o.total_cents)}{" "}
                      <span style={{ opacity: 0.7, marginLeft: 8 }}>
                        Created: {o.created_at}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatusM.mutate({ orderId: o.id, status: e.target.value })
                      }
                      disabled={updateStatusM.isPending}
                      style={{ padding: 8, borderRadius: 8 }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setOpenOrderId(isOpen ? null : o.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "transparent",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {isOpen ? "Hide items" : "View items"}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 12 }}>
                    {selectedOrderQ.isLoading ? (
                      <div style={{ opacity: 0.8 }}>Loading items...</div>
                    ) : selectedOrderQ.isError ? (
                      <ErrorState error={selectedOrderQ.error} />
                    ) : (
                      <OrderItemsBlock data={selectedOrderQ.data} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderItemsBlock({ data }) {
  const items = data?.items ?? [];
  if (items.length === 0) return <div style={{ opacity: 0.8 }}>No items found.</div>;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.12)",
        paddingTop: 12,
        marginTop: 8,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Items</div>
      <div style={{ display: "grid", gap: 6 }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              opacity: 0.95,
            }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>{it.item_name}</span>{" "}
              <span style={{ opacity: 0.8 }}>x{it.quantity}</span>
            </div>
            <div style={{ opacity: 0.9 }}>
              {money(it.line_total_cents ?? it.price_cents * it.quantity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}