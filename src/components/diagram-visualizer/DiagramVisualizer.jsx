import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export function DiagramVisualizer({ diagramDefinition, className = '' }) {
  const containerRef = useRef(null);
  const diagramId = useRef(`diagram-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !diagramDefinition) {
      return;
    }

    const renderDiagram = async () => {
      try {
        containerRef.current.innerHTML = '';
        const { svg } = await mermaid.render(diagramId.current, diagramDefinition);
        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Failed to render Mermaid diagram:', error);
        containerRef.current.innerHTML = `
          <div style="padding: 20px; border: 1px solid #ff6b6b; background: #ffe0e0; color: #d63031;">
            <strong>Diagram Render Error:</strong> ${error.message}
          </div>
        `;
      }
    };

    renderDiagram();
  }, [diagramDefinition]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      data-testid="diagram-visualizer"
    />
  );
}