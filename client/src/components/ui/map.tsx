import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  locations: { latitude: string; longitude: string; name?: string }[];
  center?: [number, number];
  zoom?: number;
}

export function Map({ 
  locations, 
  center = [51.505, -0.09], 
  zoom = 13, 
  className,
  ...props 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Initialize map only once
      leafletMap.current = L.map(mapRef.current).setView(center, zoom);

      // Add dark theme tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMap.current);

      // Create custom marker icon
      const deviceIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#3B82F6; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 0 2px rgba(59, 130, 246, 0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // Add markers for all locations
      locations.forEach(loc => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], { icon: deviceIcon }).addTo(leafletMap.current!);
          
          if (loc.name) {
            marker.bindTooltip(loc.name, {
              permanent: false,
              direction: 'top',
              className: 'bg-dark-900/80 border-0 text-xs px-1 py-0.5 rounded text-white'
            });
          }
        }
      });

      // If we have at least one valid location, center the map on it
      const validLocations = locations.filter(loc => 
        !isNaN(parseFloat(loc.latitude)) && !isNaN(parseFloat(loc.longitude))
      );
      
      if (validLocations.length > 0) {
        const lat = parseFloat(validLocations[0].latitude);
        const lng = parseFloat(validLocations[0].longitude);
        leafletMap.current.setView([lat, lng], zoom);
      }
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (leafletMap.current) {
      // Clear existing markers
      leafletMap.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          leafletMap.current!.removeLayer(layer);
        }
      });

      // Create custom marker icon
      const deviceIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#3B82F6; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 0 2px rgba(59, 130, 246, 0.5);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // Add new markers
      locations.forEach(loc => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], { icon: deviceIcon }).addTo(leafletMap.current!);
          
          if (loc.name) {
            marker.bindTooltip(loc.name, {
              permanent: false,
              direction: 'top',
              className: 'bg-dark-900/80 border-0 text-xs px-1 py-0.5 rounded text-white'
            });
          }
        }
      });

      // If we have at least one valid location, center the map on it
      const validLocations = locations.filter(loc => 
        !isNaN(parseFloat(loc.latitude)) && !isNaN(parseFloat(loc.longitude))
      );
      
      if (validLocations.length > 0) {
        const lat = parseFloat(validLocations[0].latitude);
        const lng = parseFloat(validLocations[0].longitude);
        leafletMap.current.setView([lat, lng], zoom);
      }
    }
  }, [locations]);

  return (
    <div
      ref={mapRef}
      className={cn("h-72 bg-dark-900 rounded-none w-full", className)}
      {...props}
    />
  );
}
