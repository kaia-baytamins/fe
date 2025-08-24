'use client';
import { useState, useEffect } from 'react';
import DappPortalSDK from '@linenext/dapp-portal-sdk';

const Header = ({ activeTab }) => {
  const [sdk, setSdk] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  // SDK 초기화
  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = await DappPortalSDK.init({
          clientId: '1adca77b-f876-42bb-86bf-28598b20232b', // client ID
          chainId: '1001', // kairos (mainet : 8217)
        });


        setSdk(sdk);
        setWalletProvider(walletProvider); 
        console.log('walletProvider:', walletProvider);
        const walletType = await walletProvider.getWalletType();
        console.log('지갑 타입:', walletType);
        console.log('SDK 초기화 완료');
        // console.log('지갑 주소:', accountAddress);
      } catch (error) {
        console.error('SDK 초기화 실패:', error);
      }
    };

    initSDK();
  }, []);

  // 탭별 타이틀 매핑
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'home': return 'Home';
      case 'explore': return 'Explore';
      case 'market': return 'Market';
      case 'quest': return 'Quest';
      case 'settings': return 'Settings';
      default: return 'Home';
    }
  };

  // 지갑 주소 줄임 함수
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 지갑 연결 핸들러
  const handleWalletAction = async () => {
    try {
      if (!walletAddress) {
        // 지갑 연결 요청
        const accounts = await walletProvider.kaia_requestAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]); // 첫 번째 계정 설정
          const balance = await walletProvider.kaia_getBalance();
          setWalletBalance(balance);
          console.log('지갑 연결 성공:', accounts[0]);
        }
      } else {
        // 이미 연결된 경우 - 지갑 정보 모달 표시
        setShowWalletModal(true);
      }
    } catch (error) {
      console.error('지갑 연결 실패:', error);
    }
  };

  // 지갑 연결 해제 핸들러
  const handleDisconnectWallet = async () => {
    try {
      await walletProvider.disconnectWallet();
      setWalletAddress('');
      setWalletBalance('');
      setShowWalletModal(false);
      console.log('지갑 연결 해제 성공');
    } catch (error) {
      console.error('지갑 연결 해제 실패:', error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        {/* 왼쪽 - 페이지 타이틀 */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">
            {getTabTitle(activeTab)}
          </h1>
        </div>

        {/* 오른쪽 - 지갑 연결 버튼 */}
        <button
          onClick={handleWalletAction}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-lg ${
            walletAddress
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${walletAddress ? 'bg-green-300' : 'bg-gray-300'}`} />
          <span className="text-sm">
            {walletAddress ? '지갑 연결됨' : '지갑 연결'}
          </span>
          {walletAddress && (
            <span className="text-xs opacity-80">
              {shortenAddress(walletAddress)}
            </span>
          )}
        </button>
      </header>

      {/* 지갑 정보 모달 */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full border border-slate-600">
            <div className="text-center">
              <div className="text-4xl mb-4">👛</div>
              <h3 className="text-xl font-bold text-white mb-4">
                지갑 정보
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">지갑 주소</div>
                  <div className="text-white font-mono text-sm break-all">
                    {walletAddress || 'Not connected'}
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-1">잔액</div>
                  <div className="text-white font-medium">
                    {walletBalance || '0'}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-all"
                >
                  닫기
                </button>
                <button
                  onClick={handleDisconnectWallet}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-all"
                >
                  연결 해제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
