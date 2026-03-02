import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { money } from "../../utils/format";
import {
  fetchRestaurants,
  createRestaurant,
  createRestaurantOwner,
  listAdminOrders,
  getAdminOrderById,
  setRestaurantEnabled,
} from "../../api/index";

function normalizeRestaurants(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.restaurants ?? [];
}

export default function AdminPage() {
  const qc = useQueryClient();

  const [msg, setMsg] = useState(null);

  // sorting
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // orders filters
  const [ordersRestaurantId, setOrdersRestaurantId] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);

  const restaurantsQ = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });

  const restaurants = useMemo(
    () => normalizeRestaurants(restaurantsQ.data),
    [restaurantsQ.data]
  );

  const sortedRestaurants = useMemo(() => {
    const arr = [...restaurants];
    arr.sort((a, b) => {
      const av = a?.[sortKey] ?? "";
      const bv = b?.[sortKey] ?? "";
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv));
    });
    if (sortDir === "desc") arr.reverse();
    return arr;
  }, [restaurants, sortKey, sortDir]);

  // create restaurant
  const createRestaurantM = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      setMsg({ type: "success", text: "Created restaurant!" });
      qc.invalidateQueries({ queryKey: ["restaurants"] });
      setTimeout(() => setMsg(null), 2500);
    },
    onError: (e) => setMsg({ type: "error", text: e?.response?.data?.error ?? e.message }),
  });

  // create owner
  const createOwnerM = useMutation({
    mutationFn: createRestaurantOwner,
    onSuccess: () => {
      setMsg({ type: "success", text: "Created restaurant owner!" });
      setTimeout(() => setMsg(null), 2500);
    },
    onError: (e) => setMsg({ type: "error", text: e?.response?.data?.error ?? e.message }),
  });

  // enable/disable restaurant
  const toggleEnabledM = useMutation({
    mutationFn: ({ id, enabled }) => setRestaurantEnabled(id, enabled),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: (e) => setMsg({ type: "error", text: e?.response?.data?.error ?? e.message }),
  });

  // admin orders
  const ordersQ = useQuery({
    queryKey: ["adminOrders", ordersRestaurantId || "ALL"],
    queryFn: () =>
      listAdminOrders(ordersRestaurantId ? Number(ordersRestaurantId) : null),
  });

  const orderDetailQ = useQuery({
    queryKey: ["adminOrder", openOrderId],
    queryFn: () => getAdminOrderById(openOrderId),
    enabled: !!openOrderId,
  });

  if (restaurantsQ.isLoading) return <Loading />;
  if (restaurantsQ.isError) return <ErrorState error={restaurantsQ.error} />;

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 44, margin: 0 }}>Admin Dashboard</h1>
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            Onboard restaurants and restaurant owners (role: RESTAURANT).
          </div>
        </div>
      </div>

      {msg && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: msg.type === "success" ? "rgba(0,255,120,0.10)" : "rgba(255,80,80,0.10)",
          }}
        >
          {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <Card title="Create Restaurant">
          <CreateRestaurantForm
            disabled={createRestaurantM.isPending}
            onSubmit={(payload) => createRestaurantM.mutate(payload)}
          />
        </Card>

        <Card title="Create Restaurant Owner">
          <CreateOwnerForm
            restaurants={restaurants}
            disabled={createOwnerM.isPending}
            onSubmit={(payload) => createOwnerM.mutate(payload)}
          />
        </Card>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <h2 style={{ fontSize: 28, margin: 0 }}>Restaurants</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ opacity: 0.8 }}>Sort</label>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "rgba(255,255,255,0.04)" }}>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Category</th>
                <th style={th}>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {sortedRestaurants.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.name}</td>
                  <td style={td}>{r.category}</td>
                  <td style={td}>
                    <button
                      onClick={() => toggleEnabledM.mutate({ id: r.id, enabled: !r.is_enabled })}
                      disabled={toggleEnabledM.isPending}
                      style={{
                        ...btn,
                        padding: "4px 10px",
                        background: r.is_enabled ? "rgba(0,200,100,0.15)" : "rgba(255,80,80,0.12)",
                      }}
                    >
                      {r.is_enabled ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 28, margin: 0 }}>Orders</h2>
        <div style={{ opacity: 0.8, marginTop: 6 }}>
          View orders (All restaurants or filter by restaurant).
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ opacity: 0.85 }}>Restaurant</label>
          <select
            value={ordersRestaurantId}
            onChange={(e) => {
              setOrdersRestaurantId(e.target.value);
              setOpenOrderId(null);
            }}
          >
            <option value="">All</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} (id {r.id})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          {ordersQ.isLoading ? (
            <div style={{ opacity: 0.8 }}>Loading orders…</div>
          ) : ordersQ.isError ? (
            <ErrorState error={ordersQ.error} />
          ) : (
            <AdminOrdersList
              orders={ordersQ.data?.orders ?? []}
              openOrderId={openOrderId}
              setOpenOrderId={setOpenOrderId}
              detailQ={orderDetailQ}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminOrdersList({ orders, openOrderId, setOpenOrderId, detailQ }) {
  if (!orders.length) return <div style={{ opacity: 0.8 }}>No orders.</div>;

  return (
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
                  {o.restaurant_name ? `${o.restaurant_name} • ` : ""}
                  Total: {money(o.total_cents)}
                </div>
                <div style={{ opacity: 0.7 }}>Created: {o.created_at}</div>
              </div>

              <button
                onClick={() => setOpenOrderId(isOpen ? null : o.id)}
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
                {isOpen ? "Hide items" : "View items"}
              </button>
            </div>

            {isOpen && (
              <div style={{ marginTop: 12 }}>
                {detailQ.isLoading ? (
                  <div style={{ opacity: 0.8 }}>Loading items...</div>
                ) : detailQ.isError ? (
                  <ErrorState error={detailQ.error} />
                ) : (
                  <ItemsBlock items={detailQ.data?.items ?? []} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ItemsBlock({ items }) {
  if (!items.length) return <div style={{ opacity: 0.8 }}>No items found.</div>;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Items</div>
      <div style={{ display: "grid", gap: 6 }}>
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
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

function Card({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function CreateRestaurantForm({ disabled, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    address: "",
    image_url: "",
  });

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name: form.name.trim(),
          category: form.category.trim(),
          address: form.address.trim(),
          image_url: form.image_url.trim() || null,
        });
      }}
      style={{ display: "grid", gap: 10 }}
    >
      <Field label="Name *">
        <input value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </Field>
      <Field label="Category">
        <input value={form.category} onChange={(e) => set("category", e.target.value)} />
      </Field>
      <Field label="Address">
        <input value={form.address} onChange={(e) => set("address", e.target.value)} />
      </Field>
      <Field label="Image URL">
        <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} />
      </Field>

      <button disabled={disabled} style={btn}>
        Create Restaurant
      </button>
    </form>
  );
}

function CreateOwnerForm({ restaurants, disabled, onSubmit }) {
  const [restaurantId, setRestaurantId] = useState(restaurants?.[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          restaurant_id: Number(restaurantId),
          name: name.trim(),
          email: email.trim(),
          password: tempPassword,
        });
      }}
      style={{ display: "grid", gap: 10 }}
    >
      <Field label="Restaurant *">
        <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} required>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} (id {r.id})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Name *">
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Email *">
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Temp Password *">
        <input value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} required />
      </Field>

      <button disabled={disabled} style={btn}>
        Create Restaurant Owner
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ opacity: 0.85 }}>{label}</div>
      {children}
    </label>
  );
}

const th = {
  textAlign: "left",
  padding: "12px 14px",
  fontWeight: 800,
  opacity: 0.9,
};

const td = {
  padding: "12px 14px",
  opacity: 0.95,
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
};