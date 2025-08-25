import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletComponent: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // 지갑 주소 상태
  const [tokenBalance, setTokenBalance] = useState<string | null>(null); // 토큰 잔액 상태
  const [showDisconnect, setShowDisconnect] = useState(false); // Disconnect 버튼 표시 여부

  // ERC-20 토큰 정보
  const TOKEN_CONTRACT_ADDRESS = "0x6283D8384d8F6eAF24eC44D355F31CEC0bDacE3D"; // USDT 토큰 주소
  const TOKEN_DECIMALS = 18; // 해당 토큰의 소수점 자리수
  const TOKEN_ABI = [
    // ERC-20 토큰 표준 ABI 중 balanceOf 메서드만 포함
    "function balanceOf(address owner) view returns (uint256)",
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_ABI,
        provider
      );
      const balance = await tokenContract.balanceOf(address);

      // 잔액을 읽기 쉽게 변환 (소수점 조정)
      const formattedBalance = ethers.utils.formatUnits(balance, TOKEN_DECIMALS); // 소수점 기준
      setTokenBalance(formattedBalance);
    } catch (err) {
      console.error("Failed to fetch token balance:", err);
      alert("토큰 잔액을 가져오는 데 실패했습니다.");
    }
  };

  // 지갑 연결 해제 함수
  const disconnectWallet = () => {
    setWalletAddress(null); // 지갑 주소 초기화
    setTokenBalance(null); // 토큰 잔액 초기화
    setShowDisconnect(false); // Disconnect 초기화
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
