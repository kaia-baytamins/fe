import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// MetaMask 타입 선언
declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletComponent: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // 지갑 주소 상태
  const [tokenBalance, setTokenBalance] = useState<string | null>(null); // 토큰 잔액 상태
  const [showDisconnect, setShowDisconnect] = useState(false); // Disconnect 버튼 표시 여부

  // ERC-20 토큰 정보 (Kaia Kairos Testnet용)
  const TOKEN_CONTRACT_ADDRESS = "0x6283D8384d8F6eAF24eC44D355F31CEC0bDacE3D"; // USDT 토큰 주소
  const TOKEN_DECIMALS = 18; // 해당 토큰의 소수점 자리수
  const TOKEN_ABI = [
    // ERC-20 토큰 표준 ABI 중 balanceOf 메서드만 포함
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  // 지갑 연결 함수
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask 또는 다른 Web3 지갑이 설치되어 있지 않습니다.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0]; // 첫 번째 계정 선택
      setWalletAddress(account); // 지갑 주소 저장

      // 네트워크 변경 이벤트 리스너 추가
      if (window.ethereum.on) {
        window.ethereum.on('chainChanged', (chainId: string) => {
          console.log('Network changed to:', parseInt(chainId, 16));
          // 네트워크가 변경되면 토큰 잔액을 다시 조회
          if (account) {
            setTimeout(() => fetchTokenBalance(account), 1000);
          }
        });
      }

      // 토큰 잔액 조회
      await fetchTokenBalance(account);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("지갑 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 토큰 잔액 조회 함수
  const fetchTokenBalance = async (address: string) => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 현재 네트워크 확인
      let network = await provider.getNetwork();
      console.log("Current network:", network.name, "Chain ID:", network.chainId);
      
      // Kaia Kairos Testnet 확인 (Chain ID: 1001)
      if (network.chainId !== 1001) {
        console.warn("Warning: Not connected to Kaia Kairos Testnet");
        // Kaia Kairos Testnet으로 전환 요청
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3e9' }], // 1001 in hex (Kaia Kairos Testnet)
          });
          
          // 네트워크 전환 후 잠시 대기하고 새로운 provider 생성
          await new Promise(resolve => setTimeout(resolve, 1000));
          provider = new ethers.providers.Web3Provider(window.ethereum);
          network = await provider.getNetwork();
          console.log("Switched to network:", network.name, "Chain ID:", network.chainId);
          
        } catch (switchError: any) {
          // 네트워크가 추가되지 않은 경우 추가 요청
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x3e9',
                chainName: 'Kaia Kairos Testnet',
                nativeCurrency: {
                  name: 'KAIA',
                  symbol: 'KAIA',
                  decimals: 18
                },
                rpcUrls: ['https://public-en-kairos.node.kaia.io'],
                blockExplorerUrls: ['https://kairos.kaiascan.io/']
              }],
            });
            
            // 네트워크 추가 후 잠시 대기하고 새로운 provider 생성
            await new Promise(resolve => setTimeout(resolve, 1000));
            provider = new ethers.providers.Web3Provider(window.ethereum);
            network = await provider.getNetwork();
            console.log("Added and switched to network:", network.name, "Chain ID:", network.chainId);
            
          } else {
            throw switchError;
          }
        }
      }

      // 최종 네트워크 확인
      if (network.chainId !== 1001) {
        throw new Error('Failed to switch to Kaia Kairos Testnet');
      }

      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_ABI,
        provider
      );
      
      // 컨트랙트 코드 존재 여부 확인
      const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error('Token contract not found at this address on current network');
      }
      
      // 토큰의 실제 decimals 값 가져오기
      let actualDecimals;
      try {
        actualDecimals = await tokenContract.decimals();
      } catch {
        actualDecimals = TOKEN_DECIMALS; // fallback to default
      }
      
      const balance = await tokenContract.balanceOf(address);

      // 잔액을 읽기 쉽게 변환 (실제 decimals 사용)
      const formattedBalance = ethers.utils.formatUnits(balance, actualDecimals);
      setTokenBalance(formattedBalance);
    } catch (err: any) {
      console.error("Failed to fetch token balance:", err);
      
      // 더 자세한 에러 메시지 제공
      if (err.message.includes('Token contract not found')) {
        alert("현재 네트워크에서 토큰 컨트랙트를 찾을 수 없습니다. Kaia Kairos Testnet에 연결되어 있는지 확인해주세요.");
      } else if (err.code === 'CALL_EXCEPTION') {
        alert("토큰 컨트랙트 호출에 실패했습니다. Kaia Kairos Testnet 연결 및 컨트랙트 주소를 확인해주세요.");
      } else if (err.code === 'NETWORK_ERROR') {
        console.warn("Network error detected, retrying...");
        // 네트워크 에러 시 잠시 후 재시도
        setTimeout(() => {
          if (walletAddress) {
            fetchTokenBalance(walletAddress);
          }
        }, 2000);
        return; // alert 없이 조용히 재시도
      } else {
        alert("토큰 잔액을 가져오는 데 실패했습니다: " + err.message);
      }
      
      // 오류 시 기본값 설정
      setTokenBalance("0.0");
    }
  };

  // 지갑 연결 해제 함수
  const disconnectWallet = () => {
    setWalletAddress(null); // 지갑 주소 초기화
    setTokenBalance(null); // 토큰 잔액 초기화
    setShowDisconnect(false); // Disconnect 초기화
    
    // 네트워크 변경 이벤트 리스너 제거
    if (window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      {/* 상단바 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: walletAddress ? "#FFD700" : "#4CAF50", // 연결 여부에 따라 색상 변경 (노랑: 연결됨, 초록: 연결 안됨)
          color: walletAddress ? "#000080" : "white", // 연결 상태에 따라 텍스트 색상 변경 (파랑 또는 흰색)
          borderRadius: "30px", // 둥근 모서리
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // 강조 효과
          border: "none",
          whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
        }}
        onClick={() => {
          if (walletAddress) {
            setShowDisconnect(!showDisconnect); // Disconnect 버튼 토글
          } else {
            connectWallet(); // 지갑 연결 시도
          }
        }}
      >
        {walletAddress
          ? `Token Balance: ${tokenBalance ? `${tokenBalance} USDT` : "0.0 USDT"}`
          : "Wallet Connect"} {/* 연결되지 않은 상태 */}
      </div>

      {/* Disconnect 버튼 */}
      {showDisconnect && walletAddress && (
        <div
          style={{
            position: "absolute",
            top: "100%", // 버튼 바로 아래에 표시
            right: "0",
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={disconnectWallet}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
