import { useEffect, type ReactNode } from 'react';
import { getTelegramWebApp } from '../lib/telegram';
import TopBar from './TopBar';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      if (typeof tg.expand === 'function') {
        tg.expand();
      }
    }
  }, []);

  return (
    <div className="app">
      <TopBar />
      <main className="page">{children}</main>
    </div>
  );
};

export default Layout;
