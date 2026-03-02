import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { fetchRestaurants } from "../../api/index";

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["restaurants", { search }],
    queryFn: () => fetchRestaurants(search ? { search } : {}),
  });

  if (isLoading) return <Loading label="Loading restaurants..." />;
  if (isError) return <ErrorState error={error} />;

  // backend might return { restaurants: [...] } or just [...]
  const restaurants = Array.isArray(data) ? data : data?.restaurants ?? [];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Restaurants</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants..."
          style={{ padding: 8, width: 280 }}
        />
      </div>

      {restaurants.length === 0 ? (
        <div>No restaurants found.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {restaurants.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>{r.name}</div>
              <div style={{ opacity: 0.75, marginTop: 4 }}>
                {r.address || r.location || "Syracuse, NY"}
              </div>
              <div style={{ marginTop: 8 }}>
                <Link to={`/restaurants/${r.id}`}>View menu →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}