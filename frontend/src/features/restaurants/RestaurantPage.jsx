import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { fetchRestaurant, fetchMenu, addCartItem } from "../../api/index";
import { money } from "../../utils/format";

export default function RestaurantPage() {
  const { id } = useParams();

  const [addingId, setAddingId] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);

  const qc = useQueryClient();

  const addMut = useMutation({
  mutationFn: async (menuItemId) => {
    setAddingId(menuItemId);
    return addCartItem(menuItemId, 1);
  },
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["cart"] });
  },
  onSettled: () => {
    // remove "Added!" after short delay
    setTimeout(() => setAddingId(null), 800);
  },
  });

  const restaurantQuery = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });

  const menuQuery = useQuery({
    queryKey: ["menu", id],
    queryFn: () => fetchMenu(id),
    enabled: !!id,
  });

  if (restaurantQuery.isLoading || menuQuery.isLoading)
    return <Loading label="Loading restaurant..." />;

  if (restaurantQuery.isError) return <ErrorState error={restaurantQuery.error} />;
  if (menuQuery.isError) return <ErrorState error={menuQuery.error} />;

  const restaurant = restaurantQuery.data;
  const menu = Array.isArray(menuQuery.data) ? menuQuery.data : menuQuery.data?.menu ?? [];

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Back</Link>

      <h2 style={{ marginBottom: 4 }}>{restaurant?.name ?? "Restaurant"}</h2>
      <div style={{ opacity: 0.75, marginBottom: 16 }}>
        {restaurant?.address || restaurant?.location || ""}
      </div>

      <h3 style={{ marginTop: 0 }}>Menu</h3>

      {menu.length === 0 ? (
        <div>No menu items found.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {menu.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                {item.description ? (
                  <div style={{ opacity: 0.75, marginTop: 4 }}>{item.description}</div>
                ) : null}
              </div>

              <div style={{ textAlign: "right", minWidth: 90 }}>
                <div style={{ fontWeight: 700 }}>
                  {money(item.price_cents)}
                </div>
                <button
                onClick={() => addMut.mutate(item.id ?? item.menu_item_id)}
                disabled={addMut.isPending && addingId === (item.id ?? item.menu_item_id)}
                style={{ marginTop: 8, padding: "6px 10px" }}
                >
                {addingId === (item.id ?? item.menu_item_id) ? "Added!" : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}