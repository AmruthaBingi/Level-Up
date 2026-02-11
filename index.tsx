
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState, 
  Panel,
  ReactFlowProvider,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import SkillNode from './components/SkillNode.tsx';
import Sidebar from './components/Sidebar.tsx';
import { SkillStatus, SkillNodeData, UserStats } from './types.ts';
import { INITIAL_TEMPLATES } from './constants.ts';
import { generateCareerRoadmap } from './services/geminiService.ts';
import { Sparkles, BrainCircuit, Search, Layers, ChevronRight, Loader2 } from 'lucide-react';

const nodeTypes = {
  skill: SkillNode,
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalXp: 0,
    level: 1,
    completedSkills: 0,
    currentStreak: 1,
    skillsInProgress: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(INITIAL_TEMPLATES[0].id);

  // Initial load
  useEffect(() => {
    loadTemplate(INITIAL_TEMPLATES[0].id);
  }, []);

  const loadTemplate = (templateId: string) => {
    const template = INITIAL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setNodes(template.nodes.map(n => ({ ...n, type: 'skill' })));
      setEdges(template.edges.map(e => ({
        ...e,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' }
      })));
      setActiveTemplate(templateId);
    }
  };

  const handleStatusChange = (id: string, newStatus: SkillStatus) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const oldStatus = node.data.status;
          const xpGained = newStatus === SkillStatus.COMPLETED && oldStatus !== SkillStatus.COMPLETED ? node.data.xpReward : 0;
          
          if (xpGained > 0) {
            setUserStats(prev => {
              const newXp = prev.totalXp + xpGained;
              const newLevel = Math.floor(newXp / 1000) + 1;
              return {
                ...prev,
                totalXp: newXp,
                level: newLevel,
                completedSkills: prev.completedSkills + 1
              };
            });

            // Unlock next nodes logic
            setTimeout(() => unlockNextNodes(id), 0);
          }

          return {
            ...node,
            data: { ...node.data, status: newStatus },
          };
        }
        return node;
      })
    );
  };

  const unlockNextNodes = (completedId: string) => {
    setNodes((nds) => {
      const targets = edges.filter(e => e.source === completedId).map(e => e.target);
      
      return nds.map(node => {
        if (targets.includes(node.id) && node.data.status === SkillStatus.LOCKED) {
          const prerequisites = edges.filter(e => e.target === node.id).map(e => e.source);
          const allCompleted = prerequisites.every(preId => {
            const preNode = nds.find(n => n.id === preId);
            return preNode?.data.status === SkillStatus.COMPLETED;
          });

          if (allCompleted) {
            return {
              ...node,
              data: { ...node.data, status: SkillStatus.AVAILABLE }
            };
          }
        }
        return node;
      });
    });
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateCareerRoadmap(searchQuery);
      setNodes(result.nodes.map((n: any) => ({
        ...n,
        type: 'skill',
      })));
      setEdges(result.edges.map((e: any) => ({
        ...e,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' }
      })));
      setSearchQuery('');
      setUserStats({
        totalXp: 0,
        level: 1,
        completedSkills: 0,
        currentStreak: 1,
        skillsInProgress: 0
      });
      setActiveTemplate('custom');
    } catch (error) {
      console.error(error);
      alert("Failed to generate roadmap. " + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedNode = useMemo(() => {
    const node = nodes.find(n => n.id === selectedNodeId);
    return node ? { id: node.id, data: node.data } : null;
  }, [selectedNodeId, nodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500 rounded-lg shadow-lg shadow-sky-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter">LevelUp</h1>
          </div>

          <form onSubmit={handleAiGenerate} className="flex-1 max-w-lg mx-8 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dream career? (e.g. AI Prompt Engineer, Yoga Instructor...)"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-200"
            />
            <button 
              type="submit"
              disabled={isGenerating}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isGenerating ? 'GENESIS...' : 'GENERATE'}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-[10px] font-bold text-slate-400">
              <Layers className="w-3 h-3" />
              TEMPLATES:
              {INITIAL_TEMPLATES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => loadTemplate(t.id)}
                  className={`px-2 py-0.5 rounded transition-colors ${activeTemplate === t.id ? 'bg-sky-500 text-white' : 'hover:bg-slate-700'}`}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-100" />
            
            <Panel position="bottom-left" className="bg-slate-900/90 border border-slate-700/50 p-4 rounded-xl backdrop-blur-sm m-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Mastered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Locked</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>

          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center animate-pulse">
                    <BrainCircuit className="w-10 h-10 text-sky-400" />
                  </div>
                  <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-sky-500 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Synthesizing Career Roadmap</h3>
                  <p className="text-sm text-slate-400">Our AI is mapping out the optimal path for your evolution. This takes a few cycles...</p>
                </div>
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-sky-400 uppercase">
                    <span>Constructing Nodes</span>
                    <span>AI Analysis</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full w-[85%] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Sidebar 
        selectedSkill={selectedNode} 
        onStatusChange={handleStatusChange} 
        userStats={userStats}
      />
    </div>
  );
};

const Root = () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<Root />);
}
