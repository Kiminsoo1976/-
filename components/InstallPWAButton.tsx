import React, { useState, useEffect } from 'react';
import { InstallIcon } from './icons';

// 브라우저의 BeforeInstallPromptEvent 타입을 확장하여 정의합니다.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export const InstallPWAButton: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // 기본 브라우저 프롬프트를 막습니다.
      e.preventDefault();
      // 나중에 트리거할 수 있도록 이벤트를 저장합니다.
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    // 설치 프롬프트를 표시합니다.
    await installPrompt.prompt();
    // 사용자의 선택을 기다립니다.
    const { outcome } = await installPrompt.userChoice;
    console.log(`PWA 설치 프롬프트 사용자 반응: ${outcome}`);
    // 한 번 사용된 프롬프트는 다시 사용할 수 없으므로 상태를 null로 설정합니다.
    setInstallPrompt(null);
  };

  // 설치 프롬프트 이벤트가 없으면 버튼을 렌더링하지 않습니다.
  if (!installPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 flex items-center space-x-2 animate-pulse"
      title="앱을 홈 화면에 설치"
      aria-label="앱을 홈 화면에 설치"
    >
      <InstallIcon className="w-5 h-5" />
      <span>앱 설치</span>
    </button>
  );
};