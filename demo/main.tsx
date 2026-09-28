import { createRoot } from 'react-dom/client';
import './workspace/library-styles.css';
import './demo.css';
import { Workspace } from './workspace/Workspace';

createRoot(document.getElementById('root')!).render(<Workspace />);
