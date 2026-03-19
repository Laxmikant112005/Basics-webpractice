import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Preload, Html, TransformControls } from '@react-three/drei';
import { useProgress, Html as ProgressHtml } from '@react-three/drei';

import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <ProgressHtml center>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading 3D Model</h2>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-gray-600 text-sm">{Math.round(progress)}% complete</p>
        </div>
      </div>
    </ProgressHtml>
  );
}

function Model({ url, floorPlanImage, scale = 1, position = [0, 0, 0], onSelect, selectedObject }) {
  const { scene, animations } = useGLTF(url);
  const group = useRef();

  const meshes = [];
  scene.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
    }
  });

  return (
    <group ref={group} scale={scale} position={position} dispose={null}>
      {meshes.map((mesh, index) => (
        <mesh
          key={index}
          geometry={mesh.geometry}
          material={mesh.material}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(mesh);
          }}
          userData={{ index }}
        />
      ))}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
        target={[0, 1, 0]}
      />
      {selectedObject && <TransformControls object={selectedObject} />}
    </group>
  );
}

const ModelViewer = ({ modelUrl, floorPlanImage, className = "h-96 w-full", editable = false }) => {
  const [hasModel, setHasModel] = useState(!!modelUrl);
  const [selectedObject, setSelectedObject] = useState(null);
  
  const handleSelect = (mesh) => {
    setSelectedObject(mesh);
  };

  return (
    <div className={`model-viewer rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 ${className}`}>
      {modelUrl && hasModel ? (
        <Canvas
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            <Model 
              url={modelUrl} 
              onSelect={handleSelect} 
              selectedObject={selectedObject}
              editable={editable}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      ) : (

        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">2D Floor Plan</h3>
          <p className="text-gray-600 text-center mb-6 max-w-sm">
            3D model not available. Showing floor plan layout.
          </p>
          {floorPlanImage && (
            <img 
              src={floorPlanImage}
              alt="Floor plan"
              className="w-full h-64 object-contain bg-white rounded-xl shadow-md border-4 border-dashed border-gray-200 p-4"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ModelViewer;

