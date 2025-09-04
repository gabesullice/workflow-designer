import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './DiagramVisualizer.css';

export function DiagramVisualizer({ diagramDefinition, roleColors = {}, className = '' }) {
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
        
        // Create CSS styles for role colors
        let styles = `
          <style>
            /* Modern edge label styling */
            #${diagramId.current} .edgeLabel {
              font-weight: 500 !important;
              font-size: 12px !important;
              fill: #555 !important;
            }
            
            /* Edge label background with margin */
            #${diagramId.current} .edgeLabel rect {
              fill: white !important;
              stroke: none !important;
              rx: 3px !important;
              ry: 3px !important;
            }
            
            /* Add padding to edge label text */
            #${diagramId.current} .edgeLabels .label p {
              padding: 4px 8px !important;
              margin: 0 !important;
            }
            
            
            /* Inaccessible transition styling */
            #${diagramId.current} path[id*="-inaccessible"] {
              stroke: #718096 !important;
              stroke-width: 1px !important;
              stroke-dasharray: 5 5 !important;
              opacity: 0.6 !important;
            }
        `;
        
        // Add role-specific edge styling
        Object.entries(roleColors).forEach(([roleId, color]) => {
          styles += `
            #${diagramId.current} path[id$="-${roleId}"] {
              stroke: ${color} !important;
              stroke-width: 3px !important;
            }
          `;
        });
        
        styles += '</style>';
        
        containerRef.current.innerHTML = styles + svg;
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
  }, [diagramDefinition, roleColors]);

  // Separate useEffect to color arrowheads after SVG is rendered  
  useEffect(() => {
    if (!containerRef.current || Object.keys(roleColors).length === 0) {
      return;
    }

    const colorArrowheads = () => {
      const svgElement = containerRef.current?.querySelector('svg');
      const defsElement = svgElement?.querySelector('defs') || svgElement?.querySelector('g')?.parentNode;
      
      if (svgElement && defsElement) {
        Object.entries(roleColors).forEach(([roleId, color]) => {
          // Find edges for this role
          const edgePaths = containerRef.current?.querySelectorAll(`path[id$="-${roleId}"]`);
          
          edgePaths?.forEach(edgePath => {
            const markerUrl = edgePath.getAttribute('marker-end');
            if (markerUrl) {
              const originalMarkerId = markerUrl.match(/url\(#(.+)\)/)?.[1];
              const originalMarker = containerRef.current?.querySelector(`#${originalMarkerId}`);
              
              if (originalMarker) {
                // Create a unique marker ID for this role
                const roleMarkerId = `${originalMarkerId}-${roleId}`;
                
                // Check if we already created this role-specific marker
                let roleMarker = containerRef.current?.querySelector(`#${roleMarkerId}`);
                
                if (!roleMarker) {
                  // Clone the original marker
                  roleMarker = originalMarker.cloneNode(true);
                  roleMarker.id = roleMarkerId;
                  
                  // Color the arrowhead in the cloned marker
                  const arrowPath = roleMarker.querySelector('.arrowMarkerPath');
                  if (arrowPath) {
                    arrowPath.style.fill = color + ' !important';
                    arrowPath.style.stroke = color + ' !important';
                    arrowPath.setAttribute('fill', color);
                    arrowPath.setAttribute('stroke', color);
                  }
                  
                  // Also try to color any path elements in the marker
                  const allPaths = roleMarker.querySelectorAll('path');
                  allPaths.forEach(path => {
                    path.style.fill = color + ' !important';
                    path.style.stroke = color + ' !important';
                    path.setAttribute('fill', color);
                    path.setAttribute('stroke', color);
                  });
                  
                  // Add the new marker to the defs
                  defsElement.appendChild(roleMarker);
                }
                
                // Update the edge to use the role-specific marker
                edgePath.setAttribute('marker-end', `url(#${roleMarkerId})`);
              }
            }
          });
        });
      }
    };

    // Use MutationObserver to wait for SVG to be fully rendered
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const svgElement = containerRef.current?.querySelector('svg');
          if (svgElement) {
            colorArrowheads();
            observer.disconnect(); // Stop observing once we've colored the arrowheads
          }
        }
      });
    });

    // Start observing
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, [diagramDefinition, roleColors]);

  return (
    <div 
      ref={containerRef} 
      className={`diagram-visualizer ${className}`}
      data-testid="diagram-visualizer"
    />
  );
}