
import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NameCloudProps {
  names: string[];
  rotationSpeed: number;
  isDrawing: boolean;
  winners: string[] | null;
  useRandomColors?: boolean;
}

interface NameSphereProps extends NameCloudProps {
  fontUrl?: string;
  opacityMultiplier?: number;
}

// --------------------------------------------------------
// 1. Connection Lines Component (The Sphere Mesh Structure)
// --------------------------------------------------------
const ConnectionLines: React.FC<{ positions: THREE.Vector3[] }> = ({ names, positions }) => {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const threshold = 6.5; // Distance threshold to connect nodes

    // Simple brute-force nearest neighbor connection
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < threshold) {
          points.push(positions[i]);
          points.push(positions[j]);
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [positions]);

  return (
    <lineSegments geometry={lineGeometry}>
      {/* Increased opacity (0.5) and brighter color (#60a5fa) for better visibility */}
      <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} depthWrite={false} />
    </lineSegments>
  );
};

// --------------------------------------------------------
// 2. NameTag Component (Node + Text)
// --------------------------------------------------------
const NameTag: React.FC<{
  name: string;
  position: THREE.Vector3;
  isSelected: boolean;
  useRandomColors?: boolean;
  fontUrl?: string;
  opacityMultiplier?: number;
}> = ({ name, position, isSelected, useRandomColors, fontUrl, opacityMultiplier = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // FIX: Use lookAt to face the camera directly, preventing mirrored text
      groupRef.current.lookAt(state.camera.position);
    }
  });

  const fontSize = Math.max(0.6, Math.min(1.2, 7 / (name.length + 1)));
  
  // Memoize random color so it doesn't change on every render
  const randomColor = useMemo(() => {
     // HSL Random:
     // Hue: 25 (Orange) to 340 (Pink/Magenta). Avoids 0-25 and 340-360 (Reds)
     const hue = Math.floor(Math.random() * 315) + 25;
     const sat = 85; // High saturation for vividness
     const light = 70; // High lightness for visibility on black
     return `hsl(${hue}, ${sat}%, ${light}%)`;
  }, [name]); // Re-roll only if name changes (conceptually new tag)

  // Prioritize Gold if selected, then random if enabled, else silver
  const textColor = isSelected 
    ? "#fbbf24" 
    : (useRandomColors ? randomColor : "#e2e8f0");

  const nodeColor = isSelected
    ? "#fbbf24"
    : (useRandomColors ? randomColor : "#60a5fa");

  return (
    <group position={position} ref={groupRef}>
      {/* A. The Node (Glowing Dot) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>
      
      {/* Halo for the node */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.3} />
      </mesh>

      {/* B. The Text */}
      {/* Moved slightly up (y=0.5) so it sits ON TOP of the node, not inside it */}
      <Text
        position={[0, 0.5, 0]} 
        fontSize={fontSize}
        color={textColor}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={isSelected ? 0.08 : 0.04}
        outlineColor={isSelected ? "#78350f" : "#0f172a"} // Darker outline for contrast
        fontWeight="700"
        font={fontUrl} 
        fillOpacity={opacityMultiplier}
        outlineOpacity={opacityMultiplier}
      >
        {name}
      </Text>
      
      {/* Winner Effect */}
      {isSelected && (
        <mesh position={[0, 0.5, -0.1]}>
          <circleGeometry args={[fontSize * 2.5, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.2 * opacityMultiplier} />
        </mesh>
      )}
    </group>
  );
};

// --------------------------------------------------------
// 3. Reusable Sphere of Names
// --------------------------------------------------------
const NameSphere: React.FC<NameSphereProps> = ({ names, isDrawing, winners, useRandomColors, fontUrl, opacityMultiplier }) => {
  // Generate positions ONCE based on name count
  const positions = useMemo(() => {
    const coords: THREE.Vector3[] = [];
    const count = Math.max(names.length, 1);
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < count; i++) {
      const y = count > 1 ? 1 - (i / (count - 1)) * 2 : 0; 
      const radius = Math.sqrt(1 - y * y); 
      const theta = phi * i; 
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Reduced scaleFactor from 8.5 to 7.5 to make the sphere physically smaller
      const scaleFactor = 7.5; 
      coords.push(new THREE.Vector3(x * scaleFactor, y * scaleFactor, z * scaleFactor));
    }
    return coords;
  }, [names.length]);

  return (
    <>
      {/* Draw lines between nodes */}
      <ConnectionLines names={names} positions={positions} />

      {/* Render Nodes and Names */}
      {names.map((name, i) => {
        const isSelected = winners ? winners.includes(name) : false;
        return (
          <NameTag 
            key={`${name}-${i}`} 
            name={name} 
            position={positions[i]} 
            isSelected={isSelected}
            useRandomColors={useRandomColors}
            fontUrl={fontUrl}
            opacityMultiplier={opacityMultiplier}
          />
        );
      })}
    </>
  );
};

// --------------------------------------------------------
// 4. Main Component
// --------------------------------------------------------
const NameCloud: React.FC<NameCloudProps> = ({ names, rotationSpeed, isDrawing, winners, useRandomColors }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const speed = rotationSpeed * delta;
      
      // Rotate the whole sphere structure
      groupRef.current.rotation.y += speed * 0.15;
      
      if (isDrawing) {
        groupRef.current.rotation.x += speed * 0.08;
        groupRef.current.rotation.z += speed * 0.03;
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(state.clock.elapsedTime * 0.5) * 0.15, 0.05);
      }
    }
  });

  const CHINESE_FONT_URL = "https://fonts.gstatic.com/s/notosanstc/v26/-nF7OG829OoFr2wohFbLqhiEVX9V_SsqM_H3m_8W4_G_v_0.woff";

  return (
    <group ref={groupRef}>
      <Suspense fallback={
        <NameSphere 
          names={names} 
          rotationSpeed={rotationSpeed} 
          isDrawing={isDrawing} 
          winners={winners}
          useRandomColors={useRandomColors}
          fontUrl={undefined}
          opacityMultiplier={0.7}
        />
      }>
        <NameSphere 
          names={names} 
          rotationSpeed={rotationSpeed} 
          isDrawing={isDrawing} 
          winners={winners}
          useRandomColors={useRandomColors}
          fontUrl={CHINESE_FONT_URL}
        />
      </Suspense>
    </group>
  );
};

export default NameCloud;
