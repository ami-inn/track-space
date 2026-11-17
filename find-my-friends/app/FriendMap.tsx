import React from "react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSpacetimeDB, useTable, useReducer } from "spacetimedb/react";
import { tables, reducers } from "@/src/module_bindings";
import { Providers } from "./providers";

const STEP = 0.0005;

const pin = (name: string, isMe: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `<div class="pin"${name}${isMe ? " (Me)" : ""}"><span>${name.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span></div>`,
  });

const FriendMap = () => {
  const { isActive, identity } = useSpacetimeDB();
  console.log("isActive:", isActive, "identity:", identity);
  const [users] = useTable(tables.user);
  const setName = useReducer(reducers.setName);
  const updateLocation = useReducer(reducers.updateLocation);

  const [pos, setPos] = useState(() => ({
    lat: 51.505 + (Math.random() - 0.5) * 0.004,
    lng: -0.09 + (Math.random() - 0.5) * 0.004,
  }));

  const [myName, setMyName] = useState(
    () =>
      sessionStorage.getItem("name") ||
      ` Friend ${Math.floor(Math.random() * 1000)}`,
  );

  useEffect(() => {
    if(!isActive) return;
    sessionStorage.setItem("name", myName);
    setName({name: myName});
  }, [isActive, myName]);

  useEffect(()=>{
    if(isActive) updateLocation(pos)
  }, [isActive, pos])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
        if(e.key === 'ArrowUp') setPos(pos => ({ ...pos, lat: pos.lat + STEP }));
        if(e.key === 'ArrowDown') setPos(pos => ({ ...pos, lat: pos.lat - STEP }));
        if(e.key === 'ArrowLeft') setPos(pos => ({ ...pos, lng: pos.lng - STEP }));
        if(e.key === 'ArrowRight') setPos(pos => ({ ...pos, lng: pos.lng + STEP }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const useMyLocation = ()=> navigator.geolocation.getCurrentPosition(p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude })

);


  return <main>
    <MapContainer center={pos} zoom={13} style={{ height: "100vh", width: "100%" }}>

        <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            users.filter(u => u.online && u.name).map(u => (
                <Marker key={u.identity.toHexString()} position={[u.lat, u.lng]} icon={pin(u.name, u.identity.toHexString() === identity?.toHexString())}>
                    <Popup>{u.name}</Popup>
                </Marker>
            ))
        }
    </MapContainer>

    <div className="hud">
        <span className="hint">
            {isActive ? "Use arrow keys to move" : "Connecting..."}
        </span>
        <input
            type="text"
            value={myName}
            onChange={e => setMyName(e.target.value)}
        />
        <button onClick={useMyLocation}>Use My Location</button>

    </div>
  </main>;
};

export default function Page(){
    return(
        <Providers>
            <FriendMap />
        </Providers>
    )
};
