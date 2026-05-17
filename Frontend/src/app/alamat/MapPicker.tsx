"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

type LeafletDefaultIcon = L.Icon.Default & { _getIconUrl?: unknown };

interface NominatimFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    street?: string;
    city?: string;
    country?: string;
  };
}

interface NominatimResponse {
  features?: NominatimFeature[];
}

delete (L.Icon.Default.prototype as LeafletDefaultIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  position: [number, number];
  onSelect: (lat: number, lng: number, alamat: string) => void;
}

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  map.flyTo(position, 16);
  return null;
}

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number, alamat: string) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(`/api/nominatim?lat=${lat}&lon=${lng}`);
        const data = (await res.json()) as NominatimResponse;
        const feature = data.features?.[0];
        const alamat = feature ? [
          feature.properties.name,
          feature.properties.street,
          feature.properties.city,
          feature.properties.country,
        ].filter(Boolean).join(", ") : "";
        onSelect(lat, lng, alamat);
      } catch (err) {
        console.error(err);
        onSelect(lat, lng, "");
      }
    },
  });
  return null;
}

export default function MapPicker({ position, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimFeature[]>([]);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (query.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/nominatim?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as NominatimResponse;
      setSuggestions(data.features || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item: NominatimFeature) => {
    const lat = item.geometry.coordinates[1];
    const lng = item.geometry.coordinates[0];
    const nama = [
      item.properties.name,
      item.properties.street,
      item.properties.city,
      item.properties.country,
    ].filter(Boolean).join(", ");
    setFlyTo([lat, lng]);
    setSearch(nama);
    setSuggestions([]);
    onSelect(lat, lng, nama);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari alamat..."
          className="w-full px-5 py-3 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f1b] border border-white/10 rounded-2xl overflow-hidden z-[999] shadow-xl">
            {suggestions.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#2fa84f]/20 hover:text-white transition-all border-b border-white/5 last:border-0"
              >
                {[item.properties.name, item.properties.city, item.properties.country]
                  .filter(Boolean).join(", ")}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "200px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        <Marker position={position} />
        {flyTo && <FlyToLocation position={flyTo} />}
        <ClickHandler onSelect={onSelect} />
      </MapContainer>
    </div>
  );
}
