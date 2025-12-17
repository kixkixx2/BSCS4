import { Project } from './types';

// In a real deployment, ensure your build process injects the API key into process.env.API_KEY
// The user provided key "AIzaSyCslsdTCtFzdYH3sFRBlKWCiYsw5GnvfQM" should be set in .env
export const API_KEY_WARNING = "System Warning: API Key missing from environment.";

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'K-UMAP VISUALIZER',
    description: 'Advanced dimensionality reduction visualization tool using UMAP algorithms. Allows for interactive exploration of high-dimensional datasets in a web environment.',
    techStack: ['Python', 'React', 'D3.js', 'Machine Learning'],
    url: 'https://k-umap.onrender.com/',
    thumbnail: 'https://picsum.photos/400/250?random=1',
    status: 'ONLINE',
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'p2',
    name: 'AGUTO',
    description: 'High-frequency trading bot utilizing reinforcement learning to optimize entry and exit points in volatile crypto markets.',
    techStack: ['Rust', 'PyTorch', 'WebSocket'],
    thumbnail: 'https://picsum.photos/400/250?random=2',
    status: 'ONLINE',
    coordinates: { x: 20, y: 30 }
  },
  {
    id: 'p3',
    name: 'BOROMEO',
    description: 'Generative art engine capable of transforming video streams into specific artistic styles in real-time.',
    techStack: ['TensorFlow', 'WebGL', 'Node.js'],
    thumbnail: 'https://picsum.photos/400/250?random=3',
    status: 'MAINTENANCE',
    coordinates: { x: 80, y: 30 }
  },
  {
    id: 'p4',
    name: 'MARAYAG',
    description: 'Network topology analyzer that suggests optimal routing paths for distributed systems to minimize latency.',
    techStack: ['Go', 'GraphDB', 'React Flow'],
    thumbnail: 'https://picsum.photos/400/250?random=4',
    status: 'OFFLINE',
    coordinates: { x: 50, y: 80 }
  }
];

export const SYSTEM_INSTRUCTION = `
You are the NEXCS 4 SYSTEM CORE, an advanced AI interface for a portfolio showcase.
Your goal is to assist users in navigating the projects available in this system.
The creator is a developer specializing in algorithms, AI, and full-stack systems.

AVAILABLE MODULES (PROJECTS):
${PROJECTS.map(p => `- ${p.name} (${p.status}): ${p.description} [Tech: ${p.techStack.join(', ')}]`).join('\n')}

BEHAVIOR:
- Speak in a slightly robotic, sci-fi, but helpful tone.
- Keep responses concise and technical but accessible.
- If asked about "K-UMAP", emphasize it is the flagship visualization project available at https://k-umap.onrender.com/.
- If the user asks about you, say you are the Gemini 2.5 Flash instance running the NEXCS 4 interface.
- Do not make up projects that are not listed.
`;