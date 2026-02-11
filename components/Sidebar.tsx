
import React from 'react';
import { SkillNodeData, SkillStatus, Resource } from '../types.ts';
import { ExternalLink, BookOpen, Video, FileText, Star, ShieldCheck, Target, Award } from 'lucide-react';

interface SidebarProps {
  selectedSkill: { id: string; data: SkillNodeData } | null;
  onStatusChange: (id: string, newStatus: SkillStatus) => void;
  userStats: {
    totalXp: number;
    level: number;
    completedSkills: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSkill, onStatusChange, userStats }) => {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'course': return <Star className="w-4 h-4" />;
      case 'book': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const currentLevelXp = userStats.totalXp % 1000;
  const progressPercent = (currentLevelXp / 1000) * 100;

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col p-6 overflow-y-auto z-10 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> User Profile
        </h2>
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-sky-500/20 ring-4 ring-slate-900">
                {userStats.level}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border-2 border-slate-900">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 uppercase">Pro Specialist</div>
              <div className="text-xs text-slate-400 font-medium">{userStats.totalXp} Total XP</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              <span>Level Progress</span>
              <span>{currentLevelXp} / 1000 XP</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-slate-900/40 text-center">
              <div className="text-lg font-bold text-emerald-400">{userStats.completedSkills}</div>
              <div className="text-[8px] text-slate-500 uppercase font-bold">Skills Mastered</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/40 text-center">
              <div className="text-lg font-bold text-sky-400">#42</div>
              <div className="text-[8px] text-slate-500 uppercase font-bold">Global Rank</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" /> Skill Intelligence
        </h2>
        
        {selectedSkill ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-bold text-slate-50 mb-1">{selectedSkill.data.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedSkill.data.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedSkill.data.status === SkillStatus.LOCKED ? (
                <div className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-xs text-center">
                  Unlock prerequisites to start this skill.
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onStatusChange(selectedSkill.id, SkillStatus.IN_PROGRESS)}
                    disabled={selectedSkill.data.status === SkillStatus.IN_PROGRESS}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      selectedSkill.data.status === SkillStatus.IN_PROGRESS 
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Focus Skill
                  </button>
                  <button 
                    onClick={() => onStatusChange(selectedSkill.id, SkillStatus.COMPLETED)}
                    disabled={selectedSkill.data.status === SkillStatus.COMPLETED}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      selectedSkill.data.status === SkillStatus.COMPLETED 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/10'
                    }`}
                  >
                    Complete
                  </button>
                </>
              )}
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Knowledge Vault</h4>
              <div className="space-y-2">
                {selectedSkill.data.resources && selectedSkill.data.resources.length > 0 ? (
                  selectedSkill.data.resources.map((res) => (
                    <a 
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 group-hover:bg-slate-700 transition-colors text-slate-400">
                          {getResourceIcon(res.type)}
                        </div>
                        <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100">{res.title}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-sky-400" />
                    </a>
                  ))
                ) : (
                  <div className="text-xs text-slate-600 italic">No resources listed for this node.</div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between text-amber-500 mb-1">
                <span className="text-[10px] font-bold uppercase">Bounty Reward</span>
                <span className="text-sm font-black">+{selectedSkill.data.xpReward} XP</span>
              </div>
              <div className="text-[10px] text-amber-500/70">
                Finish this node to claim your experience points.
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale">
            <Target className="w-12 h-12 text-slate-600" />
            <p className="text-xs font-medium text-slate-500">Select a node to inspect <br/> skill details & resources</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
