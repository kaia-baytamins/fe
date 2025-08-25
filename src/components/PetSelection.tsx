
import React, { useState } from 'react';
import StarBackground from '@/components/explore/StarBackground';


export default function PetSelection({ onPetSelect, userProfile }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const pets = [
    {
      name: 'Momoco | 모모코',
      shortName: 'momoco',
      image: '/images/Momoco.png',
      description: '밝고 활달한 모모코는 새로운 생명체를 만나면 눈을 반짝이며 먼저 말을 걸지도 몰라요! 외계인조차 친구로 만들어버릴지도?',
      color: 'from-pink-500 to-rose-600',
      accent: 'border-pink-300',
      confirmMessage: '반가워!! 지구 밖에는 어떤 생명체가 살고 있을까?',
    },
    {
      name: 'Panlulu | 판루루',
      shortName: 'panlulu',
      image: '/images/Panlulu.png',
      description: '지혜롭고 차분한 판루루는 우주에서 갑작스러운 일이 생겨도 절대 당황하지 않아요. 긴급 상황을 마치 퍼즐처럼 풀어내는 능력자랍니다!',
      color: 'from-blue-500 to-indigo-600',
      accent: 'border-blue-300',
      confirmMessage: '반가워!! 우주는 너무 신비로운 곳이야.. 정말 알 수 없어',
    },
    {
      name: 'Hoshitanu | 호시타누',
      shortName: 'hoshitanu',
      image: '/images/hoshitanu.png',
      description: '호시타누는 별을 너무 사랑해서 별빛을 따라다니며 탐험해요. 소행성 충돌 같은 위기도 별의 힘으로 로맨틱하게 해결할지도 몰라요!',
      color: 'from-yellow-400 to-orange-500',
      accent: 'border-yellow-300',
      confirmMessage: '반가워!! 빛과 중력의 비밀을 나랑 함께 풀어가자!',
    },
    {
      name: 'Mizuru | 미즈루',
      shortName: 'mizuru',
      image: '/images/Mizuru.png',
      description: '미즈루는 물을 좋아해 물이 있는 곳이라면 어디든 찾아낼 거예요. 우주에서도 물의 속삭임을 듣고 생명을 이어가는 평화로운 친구죠.',
      color: 'from-cyan-500 to-teal-600',
      accent: 'border-cyan-300',
      confirmMessage: '반가워! 물 좀 마실래?',
    },
  ];

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onPetSelect(selectedPet.shortName);
  };

  const handleCancel = () => {
    setSelectedPet(null);
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* 🎨 배경 컴포넌트 (외부에서 import) */}
      <StarBackground />
      
      {/* 📱 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-8">
        {/* 🎯 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-white drop-shadow-lg">
            우주탐험을 함께할 친구<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              우츄몬
            </span>을 뽑아주세요!
          </h1>
        </div>

        {/* 🎨 펫 카드 그리드 */}
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {pets.map((pet) => (
              <div
                key={pet.name}
                className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={() => handlePetClick(pet)}
              >
                {/* 🌟 카드 배경 - 회색 톤으로 변경, 고정 높이 */}
                <div className="relative bg-gradient-to-br from-slate-500 via-slate-600 to-gray-700 rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-64">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 h-full flex flex-col">
                    
                    {/* ✨ 글로우 효과 */}
                    <div className="absolute inset-0 rounded-xl border-2 border-slate-300 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* 🖼️ 이미지 컨테이너 */}
                    <div className="flex justify-center mb-3">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <div className="absolute inset-0 bg-white rounded-full shadow-lg"></div>
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="relative w-full h-full object-cover rounded-full border-4 border-white/50"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* 대체 이미지 */}
                        <div 
                          className="absolute inset-0 items-center justify-center text-2xl font-bold text-gray-600 bg-white rounded-full hidden"
                        >
                          {pet.name[0]}
                        </div>
                      </div>
                    </div>

                    {/* 🏷️ 이름 */}
                    <h2 className="text-sm sm:text-base font-bold text-white text-center mb-3 drop-shadow">
                      {pet.name}
                    </h2>

                    {/* 📄 설명 - flex-1로 남은 공간 채우기 */}
                    <div className="flex-1 flex items-center">
                      <p className="text-xs text-white/90 text-center leading-relaxed">
                        {pet.description}
                      </p>
                    </div>

                    {/* 🎯 선택 버튼 힌트 */}
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs text-white">✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔽 하단 안내 */}
        {!showConfirmation && (
          <div className="mt-8 text-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-sm text-white/80">
                카드를 터치해서 우츄몬을 선택해주세요! ✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 확인 모달 */}
      {showConfirmation && selectedPet && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          {/* 어두운 배경 */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          {/* 확인 카드 */}
          <div className="relative z-30 w-80 mx-4 transform animate-in zoom-in duration-500">
            <div className={`bg-gradient-to-br ${selectedPet.color} rounded-3xl p-1 shadow-2xl`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                
                {/* 큰 이미지 */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-white rounded-full shadow-2xl animate-pulse"></div>
                    <img
                      src={selectedPet.image}
                      alt={selectedPet.name}
                      className="relative w-full h-full object-cover rounded-full border-4 border-white/50 transform scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="absolute inset-0 items-center justify-center text-4xl font-bold text-gray-600 bg-white rounded-full hidden"
                    >
                      {selectedPet.name[0]}
                    </div>
                  </div>
                </div>

                {/* 이름 */}
                <h2 className="text-xl font-bold text-white text-center mb-4 drop-shadow-lg">
                  {selectedPet.name}
                </h2>

                {/* 확인 메시지 */}
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                  <p className="text-lg text-white text-center font-medium">
                    {userProfile?.displayName || '탐험가'} {selectedPet.confirmMessage}
                  </p>
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 bg-gray-600/80 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    다시 선택
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 bg-gradient-to-r ${selectedPet.color} hover:shadow-lg text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105`}
                  >
                    확인! 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}