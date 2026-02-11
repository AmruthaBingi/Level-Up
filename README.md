# LevelUp: Career Skill Tree Builder

LevelUp is a gamified, AI-powered career roadmap builder that transforms the daunting task of career planning into an engaging, RPG-style progression system. Users can visualize their professional growth through interactive "skill trees," track their progress with XP, and unlock new learning paths.

## 🚀 Key Features

- **AI-Powered Roadmaps**: Generate custom, detailed career trees for any profession (from "AI Engineer" to "Urban Gardener") using Google's Gemini 3 Pro.
- **Interactive Visual Graph**: Built with `React Flow`, allowing users to explore skill dependencies, drag nodes, and visualize their journey.
- **Gamified Progression**: 
  - **XP System**: Earn experience points for completing skill nodes.
  - **Leveling**: Automatically level up as you master new skills.
  - **Prerequisite Logic**: Skills remain locked until their foundational prerequisites are completed.
- **Resource Integration**: Each skill node comes with a "Knowledge Vault" containing curated links to articles, videos, and courses.
- **Career Templates**: Quick-start paths for popular careers like Frontend Architecture and Data Science.
- **Intelligence Sidebar**: A focused view for inspecting skill details, managing status, and accessing learning materials.

## 🛠️ Tech Stack

- **Framework**: React 19 (ESM)
- **Visuals**: React Flow 11
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini 3 API (`@google/genai`)
- **Icons**: Lucide React
- **Typography**: Inter & JetBrains Mono

## 🎮 How to Use

1. **Choose a Path**: Select a template from the header or use the AI generator to create a custom roadmap.
2. **Inspect Skills**: Click on any unlocked node to view its description and learning resources in the sidebar.
3. **Master Skills**: Change a skill's status to "In Progress" to focus on it, then "Completed" to earn XP and unlock the next tier of nodes.
4. **Level Up**: Watch your profile grow as you accumulate XP and climb the global rank.

## 📝 Design Philosophy

LevelUp aims to solve "learning paralysis" by breaking down complex career paths into manageable, bite-sized achievements. The dark-themed, high-contrast UI is designed to reduce eye strain during long learning sessions while maintaining a futuristic, high-stakes "gaming" aesthetic.
