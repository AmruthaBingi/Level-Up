
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SkillStatus, SkillNodeData } from '../types.ts';
import { Lock, Unlock, CheckCircle, Zap } from 'lucide-react';

const SkillNode: React.FC<NodeProps<SkillNodeData>> = ({ data, selected }) => {
  const isLocked = data.status === SkillStatus.LOCKED;
  const isCompleted = data.status === SkillStatus.COMPLETED;
  const isInProgress = data.status === SkillStatus.IN_PROGRESS;

  const getStatusStyles = () => {
    if (isCompleted) return 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (isInProgress) return 'border-sky-500 bg-sky-950/40 text-sky-100 shadow-[0_0_15px_rgba(14,165,233,0.3)]';
    if (isLocked) return 'border-slate-700 bg-slate-900/40 text-slate-500 grayscale';
    return 'border-amber-500 bg-amber-950/40 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
  };

  const getIcon = () => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (isInProgress) return <Zap className="w-4 h-4 text-sky-400 animate-pulse" />;
    if (isLocked) return <Lock className="w-4 h-4 text-slate-500" />;
    return <Unlock className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 w-48 relative ${getStatusStyles()} ${selected ? 'ring-2 ring-sky-300' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            Lvl {data.level}
          </span>
          {getIcon()}
        </div>
        
        <h3 className="text-sm font-bold leading-tight truncate">{data.label}</h3>
        
        <div className="flex items-center gap-1 mt-1">
          <div className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-mono">
            {data.xpReward} XP
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
    </div>
  );
};

export default memo(SkillNode);
