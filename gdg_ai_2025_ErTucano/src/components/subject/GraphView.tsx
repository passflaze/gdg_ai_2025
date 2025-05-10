import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import CardContainer from '../common/CardContainer';

const GraphView: React.FC = () => {
  const { selectedSubject } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!selectedSubject || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Set canvas size to match parent container
    canvas.width = parent.clientWidth;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw chapter nodes and connections
    const chapters = selectedSubject.chapters;
    const nodeRadius = 40;
    const horizontalGap = canvas.width / (chapters.length + 1);
    
    // Draw connections first (so they appear behind nodes)
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 2;
    
    chapters.forEach((chapter, index) => {
      const x = horizontalGap * (index + 1);
      const y = canvas.height / 2;

      // Draw prerequisite connections
      chapter.prerequisites.forEach(prereqId => {
        const prereqIndex = chapters.findIndex(ch => ch.id === prereqId);
        if (prereqIndex !== -1) {
          const startX = horizontalGap * (prereqIndex + 1);
          const startY = canvas.height / 2;
          
          // Draw curved path
          ctx.beginPath();
          ctx.moveTo(startX + nodeRadius, startY);
          
          // Control points for the curve
          const controlX = (startX + x) / 2;
          const controlY = startY - 50;
          
          ctx.quadraticCurveTo(controlX, controlY, x - nodeRadius, y);
          ctx.stroke();
          
          // Draw arrow at the end
          const angle = Math.atan2(y - controlY, x - nodeRadius - controlX);
          ctx.beginPath();
          ctx.moveTo(x - nodeRadius, y);
          ctx.lineTo(
            x - nodeRadius - 10 * Math.cos(angle - Math.PI / 6), 
            y - 10 * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            x - nodeRadius - 10 * Math.cos(angle + Math.PI / 6), 
            y - 10 * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = '#4B5563';
          ctx.fill();
        }
      });
    });

    // Draw nodes
    chapters.forEach((chapter, index) => {
      const x = horizontalGap * (index + 1);
      const y = canvas.height / 2;
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      
      // Fill based on progress
      const gradient = ctx.createLinearGradient(
        x - nodeRadius, 
        y - nodeRadius, 
        x + nodeRadius, 
        y + nodeRadius
      );
      
      // Determine colors based on progress
      if (chapter.progress === 100) {
        // Completed
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#059669');
      } else if (chapter.progress > 0) {
        // In progress
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#7C3AED');
      } else {
        // Not started
        gradient.addColorStop(0, '#4B5563');
        gradient.addColorStop(1, '#374151');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw progress indicator as a ring
      if (chapter.progress > 0 && chapter.progress < 100) {
        ctx.beginPath();
        ctx.arc(
          x, 
          y, 
          nodeRadius, 
          -Math.PI / 2, 
          (chapter.progress / 100) * Math.PI * 2 - Math.PI / 2
        );
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Add chapter title text
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text if needed
      const words = chapter.title.split(' ');
      let line = '';
      let lines = [];
      const maxWidth = nodeRadius * 1.5;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      // Draw each line
      lines.forEach((line, i) => {
        ctx.fillText(
          line, 
          x, 
          y + (i - (lines.length - 1) / 2) * 15
        );
      });
      
      // Add progress text below node
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillText(`${chapter.progress}% Complete`, x, y + nodeRadius + 15);
    });
    
  }, [selectedSubject]);

  if (!selectedSubject) return null;

  return (
    <div className="p-6">
      <CardContainer className="p-6 min-h-[500px] relative">
        <h3 className="text-xl font-medium text-white mb-6">
          Chapter Progress Flow
        </h3>
        <canvas 
          ref={canvasRef} 
          className="w-full" 
        />
        <div className="flex justify-center space-x-8 mt-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-sm text-gray-400">Not Started</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-400">Completed</span>
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default GraphView;