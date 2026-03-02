import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { money } from "../../utils/format";
import { fetchMyOrders, fetchOrderById } from "../../api/index";

export default function OrdersPage() {
  const [openId, setOpenId] = useState(null);

  const listQ = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
  });

  const detailQ = useQuery({
    queryKey: ["myOrder", openId],
    queryFn: () => fetchOrderById(openId),
    enabled: !!openId,
  });

  if (listQ.isLoading) return <Loading />;
  if (listQ.isError) return <ErrorState error={listQ.error} />;

  const orders = listQ.data?.orders ?? [];

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ opacity: 0.8 }}>No orders yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => {
            const isOpen = openId === o.id;
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
                      Order #{o.id}
                    </div>
                    <div style={{ opacity: 0.85 }}>
                      Status: {o.status} • Total: {money(o.total_cents)}
                    </div>
                    <div style={{ opacity: 0.7 }}>Created: {o.created_at}</div>
                    <div style={{ opacity: 0.7 }}>Restaurant ID: {o.restaurant_id}</div>
                  </div>

                  <button
                    onClick={() => setOpenId(isOpen ? null : o.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "transparent",
                      color: "white",
                      cursor: "pointer",
                      height: 40,
                    }}
                  >
                    {isOpen ? "Hide details" : "View details"}
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 12 }}>
                    {detailQ.isLoading ? (
                      <div style={{ opacity: 0.8 }}>Loading items...</div>
                    ) : detailQ.isError ? (
                      <ErrorState error={detailQ.error} />
                    ) : (
                      <CustomerOrderDetail data={detailQ.data} />
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

function CustomerOrderDetail({ data }) {
  const items = data?.items ?? [];
  if (!items.length) return <div style={{ opacity: 0.8 }}>No items found.</div>;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.12)",
        paddingTop: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Items</div>
      <div style={{ display: "grid", gap: 6 }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>{it.item_name}</span>{" "}
              <span style={{ opacity: 0.8 }}>x{it.quantity}</span>
            </div>
            <div style={{ opacity: 0.9 }}>{money(it.line_total_cents)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}