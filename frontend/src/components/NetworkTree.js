import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './NetworkTree.css';

const NetworkTree = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    // Limpiar SVG anterior y tooltips
    d3.select(svgRef.current).selectAll('*').remove();
    d3.select('body').selectAll('.tooltip').remove();

    const width = containerRef.current.clientWidth || 1200;
    const height = Math.max(600, data.length * 150);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Convertir array plano a estructura de árbol
    const dataMap = new Map();
    let rootNode = null;

    // Primero, crear mapa de todos los nodos
    data.forEach(node => {
      dataMap.set(node.id, { ...node, children: [] });
      if (!node.parent_id) {
        rootNode = node;
      }
    });

    // Construir árbol
    dataMap.forEach((node, id) => {
      if (node.parent_id && dataMap.has(node.parent_id)) {
        const parent = dataMap.get(node.parent_id);
        parent.children.push(node);
      }
    });

    // Si no hay rootNode, usar el primer elemento
    if (!rootNode && data.length > 0) {
      rootNode = data[0];
    }

    if (!rootNode) return;

    const root = d3.hierarchy(dataMap.get(rootNode.id) || rootNode, d => d.children);
    const treeLayout = d3.tree().size([height - 100, width - 200]);

    treeLayout(root);

    // Agregar links
    const links = svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y + 100)
        .y(d => d.x + 50)
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    // Agregar nodos
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y + 100},${d.x + 50})`);

    // Círculos para nodos
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        const level = d.depth;
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];
        return colors[level % colors.length];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Etiquetas de texto
    nodes.append('text')
      .attr('dy', -25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.data.name || d.data.code || 'N/A')
      .attr('fill', '#333');

    // Información adicional
    nodes.append('text')
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text(d => `Puntos: ${d.data.points || 0}`)
      .attr('fill', '#666');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    nodes.on('mouseover', function(event, d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(`
        <strong>${d.data.name || 'N/A'}</strong><br/>
        Código: ${d.data.code || 'N/A'}<br/>
        Rango: ${d.data.rank_name || 'N/A'}<br/>
        Puntos: ${d.data.points || 0}<br/>
        Nivel: ${d.depth}
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

  }, [data]);

  return (
    <div ref={containerRef} className="network-tree-container">
      <svg ref={svgRef} className="network-tree-svg"></svg>
    </div>
  );
};

export default NetworkTree;

