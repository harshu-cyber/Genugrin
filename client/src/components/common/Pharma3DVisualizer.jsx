import React, { useEffect, useRef } from 'react';

// Rich, multi-element pharmaceutical 3D molecular structure (Pure 3D Diagram - NO Text)
const MOLECULE_NODES = [
  { x: 0, y: 0, z: 0, r: 18, color: '#10B981', glow: '#34D399' },
  { x: 80, y: -50, z: 40, r: 14, color: '#3B82F6', glow: '#60A5FA' },
  { x: -80, y: -50, z: -40, r: 14, color: '#3B82F6', glow: '#60A5FA' },
  { x: 0, y: 95, z: -50, r: 15, color: '#147D55', glow: '#10B981' },
  { x: 135, y: 20, z: -25, r: 12, color: '#06B6D4', glow: '#22D3EE' },
  { x: -135, y: 20, z: 25, r: 12, color: '#10B981', glow: '#34D399' },
  { x: 55, y: 125, z: 60, r: 10, color: '#F59E0B', glow: '#FBBF24' },
  { x: -55, y: 125, z: -60, r: 10, color: '#F59E0B', glow: '#FBBF24' },
  { x: 100, y: -115, z: 15, r: 10, color: '#60A5FA', glow: '#93C5FD' },
  { x: -100, y: -115, z: -15, r: 10, color: '#60A5FA', glow: '#93C5FD' },
  { x: 0, y: -90, z: 80, r: 13, color: '#34D399', glow: '#6EE7B7' },
  { x: 0, y: 0, z: -105, r: 11, color: '#38BDF8', glow: '#7DD3FC' },
  { x: 70, y: 60, z: -80, r: 11, color: '#2DD4BF', glow: '#5EEAD4' },
  { x: -70, y: 60, z: 80, r: 11, color: '#2DD4BF', glow: '#5EEAD4' },
  { x: 150, y: -40, z: 70, r: 9, color: '#A78BFA', glow: '#C4B5FD' },
  { x: -150, y: -40, z: -70, r: 9, color: '#A78BFA', glow: '#C4B5FD' },
];

const MOLECULE_BONDS = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 5],
  [3, 6], [3, 7], [1, 8], [2, 9], [0, 10],
  [0, 11], [3, 12], [3, 13], [1, 14], [2, 15],
  [4, 14], [5, 15], [10, 6], [10, 7]
];

export default function Pharma3DVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let angleX = 0.35;
    let angleY = 0.55;
    let targetAngleX = angleX;
    let targetAngleY = angleY;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onMouseDown = (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        targetAngleY = (mouseX / rect.width) * 1.8;
        targetAngleX = -(mouseY / rect.height) * 1.8;
        return;
      }
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      angleY += dx * 0.009;
      angleX += dy * 0.009;
      targetAngleX = angleX;
      targetAngleY = angleY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const fov = 380;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Smooth auto-rotation
      if (!isDragging) {
        angleY += 0.008;
        angleX += (targetAngleX - angleX) * 0.04;
      }

      const sinX = Math.sin(angleX);
      const cosX = Math.cos(angleX);
      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);

      // 3D Matrix Projection
      const projectedNodes = MOLECULE_NODES.map((node) => {
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        const distance = fov + z2;
        const scale = distance > 0 ? fov / distance : 0;
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const projR = Math.max(3, node.r * scale);

        return {
          ...node,
          projX,
          projY,
          projR,
          depth: z2,
          scale,
        };
      });

      // Ambient 3D Depth Rings / Orbital Aura (Subtle Colorful Glow)
      ctx.save();
      const auraGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 220);
      auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      auraGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw 3D Cylindrical Bonds
      const sortedBonds = [...MOLECULE_BONDS].sort((a, b) => {
        const depthA = (projectedNodes[a[0]].depth + projectedNodes[a[1]].depth) / 2;
        const depthB = (projectedNodes[b[0]].depth + projectedNodes[b[1]].depth) / 2;
        return depthA - depthB;
      });

      sortedBonds.forEach(([idxA, idxB]) => {
        const nodeA = projectedNodes[idxA];
        const nodeB = projectedNodes[idxB];
        const avgDepth = (nodeA.depth + nodeB.depth) / 2;
        const alpha = Math.min(1, Math.max(0.3, (avgDepth + 180) / 360));

        const grad = ctx.createLinearGradient(nodeA.projX, nodeA.projY, nodeB.projX, nodeB.projY);
        grad.addColorStop(0, nodeA.color);
        grad.addColorStop(1, nodeB.color);

        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.beginPath();
        ctx.moveTo(nodeA.projX, nodeA.projY);
        ctx.lineTo(nodeB.projX, nodeB.projY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(2, 5 * ((avgDepth + 220) / 380));
        ctx.stroke();

        // High-energy glowing bond core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(1, 1.8 * ((avgDepth + 220) / 380));
        ctx.globalAlpha = alpha * 0.55;
        ctx.stroke();
        ctx.restore();
      });

      // Draw 3D Spheres (Back to Front)
      const sortedNodes = [...projectedNodes].sort((a, b) => a.depth - b.depth);

      sortedNodes.forEach((node) => {
        const depthNorm = Math.min(1, Math.max(0.35, (node.depth + 180) / 360));

        // Soft outer glow for each atom
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.projR * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = node.glow;
        ctx.globalAlpha = 0.25 * depthNorm;
        ctx.fill();
        ctx.restore();

        // 3D Sphere Radial Gradient with Specular Highlight
        const highlightOffset = node.projR * 0.35;
        const sphereGrad = ctx.createRadialGradient(
          node.projX - highlightOffset,
          node.projY - highlightOffset,
          node.projR * 0.08,
          node.projX,
          node.projY,
          node.projR
        );

        sphereGrad.addColorStop(0, '#FFFFFF');
        sphereGrad.addColorStop(0.25, node.glow);
        sphereGrad.addColorStop(0.65, node.color);
        sphereGrad.addColorStop(1, '#091E2A');

        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.projR, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // Specular rim light
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = Math.max(1, 1.5 * node.scale);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
