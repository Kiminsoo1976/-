import React from 'react';
import { QrCodeIcon, WifiIcon, WarningIcon, SmartphoneIcon } from './icons';

interface MobileHelpProps {
  onClose: () => void;
}

const Step: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <li className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-lg text-gray-200">{title}</h4>
            <p className="text-gray-400 text-sm">{children}</p>
        </div>
    </li>
);

export const MobileHelp: React.FC<MobileHelpProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-bold text-center text-cyan-400">스마트폰에서 앱 실행하기</h2>
        
        <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/30">
            <h3 className="font-bold text-cyan-300 mb-2">핵심 정보</h3>
            <p className="text-sm text-gray-300">
                스마트폰에서 이 앱을 원활하게 테스트하려면 개발 환경에서 제공하는 **QR 코드**를 사용하는 것이 가장 좋습니다.
            </p>
        </div>

        <div>
            <h3 className="font-bold text-xl text-gray-200 mb-4 text-center">권장 실행 방법</h3>
            <ol className="space-y-4">
               <Step icon={<QrCodeIcon className="w-5 h-5"/>} title="1단계: QR 코드 찾기">
                    QR 코드는 일반적으로 앱 미리보기의 <strong>오른쪽 패널</strong>에 있습니다. 개발 도구는 보통 <strong>[코드 편집기 | 앱 미리보기 | QR코드 패널]</strong> 구조를 가집니다.
                </Step>
                <Step icon={<WifiIcon className="w-5 h-5"/>} title="2단계: 동일 Wi-Fi 네트워크 연결">
                    컴퓨터와 스마트폰이 <span className="font-bold text-cyan-400">동일한 Wi-Fi 네트워크</span>에 연결되어 있는지 확인하세요.
                </Step>
                <Step icon={<SmartphoneIcon className="w-5 h-5"/>} title="3단계: QR 코드 스캔 및 실행">
                    스마트폰 카메라로 QR 코드를 스캔하여 나타나는 링크를 열면 앱에 접속할 수 있습니다.
               </Step>
            </ol>
        </div>

        <div className="pt-4 border-t border-gray-700">
             <h3 className="font-bold text-lg text-yellow-300 mb-2 flex items-center">
                <WarningIcon className="w-5 h-5 mr-2"/>
                문제 해결: QR 코드가 보이지 않나요?
            </h3>
            <p className="text-sm text-gray-400 mb-3">
                사용자님의 환경에서는 QR 코드 패널이 보이지 않을 수 있습니다. 이는 앱의 문제가 아닌, 개발 도구의 창 크기나 레이아웃 설정 때문일 수 있습니다. 아래 방법을 시도해 보세요.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                <li><span className="font-semibold">창 크기 조절:</span> 브라우저 창을 더 크게 만들거나, 코드와 미리보기 화면 사이의 경계선을 드래그하여 레이아웃을 조절해 보세요. 숨겨진 패널이 나타날 수 있습니다.</li>
                <li><span className="font-semibold">'전체 화면' 모드 활용:</span> 미리보기 상단의 '전체 화면' 버튼을 눌렀다가 다시 돌아오면 레이아웃이 재조정될 수 있습니다.</li>
                <li><span className="font-semibold">최후의 수단:</span> 위 방법으로도 해결되지 않으면, 현재 환경에서는 모바일 테스트가 어려울 수 있습니다. 이 앱은 PC 브라우저에서도 모든 기능 테스트가 가능합니다.</li>
            </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
};
