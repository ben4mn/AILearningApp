import { HashRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/layout/BottomNav';
import { FeedPage } from './pages/FeedPage';
import { ReaderPage } from './pages/ReaderPage';
import { ProgressPage } from './pages/ProgressPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/read/:topicSlug/:lessonSlug" element={<ReaderPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
      <BottomNav />
    </HashRouter>
  );
}
