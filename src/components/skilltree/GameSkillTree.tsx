import React, { useEffect, useRef, useCallback, useState, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { Text, tokens } from '@fluentui/react-components';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'creative' | 'academic' | 'social' | 'physical' | 'mindset';
  level: number;
  maxLevel: number;
  prerequisites: string[];
  unlockedAt: string | null;
}

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: Skill['category'];
  skill: Skill;
  status: 'unlocked' | 'locked' | 'available' | 'ai-recommended';
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
}

export interface GameSkillTreeRef {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: '#5eb8ff',
  creative: '#ffb366',
  academic: '#4ade80',
  social: '#c4a5f7',
  physical: '#ff7a7a',
  mindset: '#ffd966',
};

const NODE_CONFIG = {
  unlocked: {
    fill: 'rgba(30, 30, 35, 0.95)',
    stroke: '#60cdff',
    strokeWidth: 3,
    glow: 'rgba(96, 205, 255, 0.4)',
    iconColor: '#60cdff',
  },
  available: {
    fill: 'rgba(30, 30, 35, 0.8)',
    stroke: 'rgba(255, 255, 255, 0.3)',
    strokeWidth: 2,
    glow: 'rgba(255, 255, 255, 0.1)',
    iconColor: 'rgba(255, 255, 255, 0.6)',
  },
  locked: {
    fill: 'rgba(20, 20, 25, 0.6)',
    stroke: 'rgba(255, 255, 255, 0.1)',
    strokeWidth: 1,
    glow: 'transparent',
    iconColor: 'rgba(255, 255, 255, 0.2)',
  },
  'ai-recommended': {
    fill: 'rgba(30, 30, 35, 0.9)',
    stroke: '#ffd966',
    strokeWidth: 3,
    glow: 'rgba(255, 217, 102, 0.5)',
    iconColor: '#ffd966',
  },
};

interface GameSkillTreeProps {
  skills: Skill[];
  onSkillClick: (skill: Skill) => void;
  aiRecommendations?: string[];
}

export const GameSkillTree = React.forwardRef<GameSkillTreeRef, GameSkillTreeProps>(
  ({ skills, onSkillClick, aiRecommendations = [] }, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    const simulationRef = useRef<d3.Simulation<NodeDatum, LinkDatum> | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getNodeStatus = useCallback((skill: Skill): NodeDatum['status'] => {
      if (skill.unlockedAt) return 'unlocked';
      if (aiRecommendations.includes(skill.id)) return 'ai-recommended';
      
      const prereqsUnlocked = skill.prerequisites.every(preId => {
        const preSkill = skills.find(s => s.id === preId);
        return preSkill?.unlockedAt != null;
      });
      
      if (prereqsUnlocked || skill.prerequisites.length === 0) return 'available';
      return 'locked';
    }, [skills, aiRecommendations]);

    useImperativeHandle(ref, () => ({
      handleZoomIn: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy as any, 1.3);
        }
      },
      handleZoomOut: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy as any, 0.7);
        }
      },
      handleResetZoom: () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(750)
            .call(zoomRef.current.transform as any, d3.zoomIdentity);
        }
      },
    }));

    const initChart = useCallback(() => {
      try {
        if (!svgRef.current || !containerRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        svg.attr('width', width).attr('height', height);

        const g = svg.append('g');
        gRef.current = g;

        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.3, 3])
          .on('zoom', (event) => {
            g.attr('transform', event.transform.toString());
          });

        zoomRef.current = zoom;
        svg.call(zoom as any);

        const nodes: NodeDatum[] = skills.map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level,
          maxLevel: s.maxLevel,
          category: s.category,
          skill: s,
          status: getNodeStatus(s),
        }));

        const skillIds = new Set(skills.map(s => s.id));
        const links: LinkDatum[] = [];
        skills.forEach((skill) => {
          skill.prerequisites.forEach((preId) => {
            if (skillIds.has(preId)) {
              links.push({ source: preId, target: skill.id });
            }
          });
        });

        const simulation = d3
          .forceSimulation<NodeDatum>(nodes)
          .force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id((d) => d.id).distance(180))
          .force('charge', d3.forceManyBody().strength(-800))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(70));

        simulationRef.current = simulation;

        const defs = svg.append('defs');
        
        const unlockedGlow = defs.append('filter')
          .attr('id', 'unlocked-glow')
          .attr('x', '-50%')
          .attr('y', '-50%')
          .attr('width', '200%')
          .attr('height', '200%');
        unlockedGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
        const unlockedMerge = unlockedGlow.append('feMerge');
        unlockedMerge.append('feMergeNode').attr('in', 'coloredBlur');
        unlockedMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        const aiGlow = defs.append('filter')
          .attr('id', 'ai-glow')
          .attr('x', '-50%')
          .attr('y', '-50%')
          .attr('width', '200%')
          .attr('height', '200%');
        aiGlow.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'coloredBlur');
        const aiMerge = aiGlow.append('feMerge');
        aiMerge.append('feMergeNode').attr('in', 'coloredBlur');
        aiMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        const link = g.append('g').selectAll('line')
          .data(links)
          .join('line')
          .attr('stroke', (d) => {
            const targetNode = nodes.find(n => n.id === (d.target as NodeDatum).id);
            if (targetNode?.status === 'unlocked') return 'rgba(96, 205, 255, 0.4)';
            if (targetNode?.status === 'available') return 'rgba(255, 255, 255, 0.15)';
            return 'rgba(255, 255, 255, 0.05)';
          })
          .attr('stroke-width', (d) => {
            const targetNode = nodes.find(n => n.id === (d.target as NodeDatum).id);
            if (targetNode?.status === 'unlocked') return 3;
            if (targetNode?.status === 'available') return 2;
            return 1;
          })
          .attr('stroke-dasharray', (d) => {
            const targetNode = nodes.find(n => n.id === (d.target as NodeDatum).id);
            return targetNode?.status === 'locked' ? '4,4' : 'none';
          });

        const node = g.append('g').selectAll('g')
          .data(nodes)
          .join('g')
          .attr('cursor', (d) => d.status === 'locked' ? 'not-allowed' : 'pointer')
          .call(d3.drag<SVGGElement, NodeDatum>()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }));

        node.append('circle')
          .attr('r', (d) => d.status === 'ai-recommended' ? 42 : d.status === 'unlocked' ? 40 : 0)
          .attr('fill', 'transparent')
          .attr('stroke', (d) => NODE_CONFIG[d.status].glow)
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)
          .attr('filter', (d) => d.status === 'ai-recommended' ? 'url(#ai-glow)' : d.status === 'unlocked' ? 'url(#unlocked-glow)' : '');

        node.append('circle')
          .attr('r', 32)
          .attr('fill', (d) => NODE_CONFIG[d.status].fill)
          .attr('stroke', (d) => CATEGORY_COLORS[d.category])
          .attr('stroke-width', (d) => NODE_CONFIG[d.status].strokeWidth)
          .attr('stroke-opacity', (d) => d.status === 'locked' ? 0.3 : 1);

        node.append('circle')
          .attr('r', 36)
          .attr('fill', 'none')
          .attr('stroke', (d) => d.status === 'unlocked' ? CATEGORY_COLORS[d.category] : 'transparent')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', (d) => {
            if (d.status !== 'unlocked') return '0, 226';
            const progress = d.level / d.maxLevel;
            const circumference = 2 * Math.PI * 36;
            return `${circumference * progress}, ${circumference}`;
          })
          .attr('transform', 'rotate(-90)')
          .attr('opacity', 0.8);

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('fill', (d) => NODE_CONFIG[d.status].iconColor)
          .text((d) => d.name.charAt(0));

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '55')
          .attr('font-size', '13px')
          .attr('font-weight', '500')
          .attr('fill', (d) => d.status === 'locked' ? 'rgba(255,255,255,0.3)' : '#fff')
          .text((d) => d.name);

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '70')
          .attr('font-size', '11px')
          .attr('fill', (d) => CATEGORY_COLORS[d.category])
          .text((d) => d.status === 'unlocked' ? `Lv.${d.level}/${d.maxLevel}` : '');

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '-45')
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('fill', '#ffd966')
          .attr('opacity', (d) => d.status === 'ai-recommended' ? 1 : 0)
          .text('AI 推荐');

        node.on('click', (event, d) => {
          if (d.status !== 'locked') {
            onSkillClick(d.skill);
          }
        });

        simulation.on('tick', () => {
          link
            .attr('x1', (d) => (d.source as NodeDatum).x!)
            .attr('y1', (d) => (d.source as NodeDatum).y!)
            .attr('x2', (d) => (d.target as NodeDatum).x!)
            .attr('y2', (d) => (d.target as NodeDatum).y!);

          node.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });
      } catch (e: any) {
        setError(e.message);
        console.error('D3 rendering error:', e);
      }
    }, [skills, onSkillClick, getNodeStatus]);

    useEffect(() => {
      initChart();
      const handleResize = () => initChart();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [initChart]);

    if (error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
          <Text size={400} weight="semibold">渲染错误</Text>
          <div>{error}</div>
        </div>
      );
    }

    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
);

GameSkillTree.displayName = 'GameSkillTree';

export default GameSkillTree;
