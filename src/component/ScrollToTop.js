import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // 取得當前路徑
  useEffect(() => {
    window.scrollTo(0, 0); // 滾動到最上方
  }, [pathname]); // 當路由變化時執行
  return null; // 這個元件不需要回傳 JSX
};

export default ScrollToTop;
