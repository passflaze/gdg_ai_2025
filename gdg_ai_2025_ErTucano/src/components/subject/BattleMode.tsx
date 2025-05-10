import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CardContainer from '../common/CardContainer';
import { Swords, Play, Shield, Trophy, Clock } from 'lucide-react';

const BattleMode: React.FC = () => {
  const { selectedSubject } = useAppContext();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  if (!selectedSubject) return null;

  const battleModes = [
    {
      id: 'quickfire',
      title: 'Quick Fire',
      description: 'Race against the clock to answer as many questions as possible in 2 minutes',
      icon: Clock,
      color: '#F97316' // Orange
    },
    {
      id: 'challenge',
      title: 'Challenge Mode',
      description: 'Test your knowledge with increasingly difficult questions',
      icon: Shield,
      color: '#8B5CF6' // Purple
    },
    {
      id: 'tournament',
      title: 'Tournament',
      description: 'Compete against yourself or friends to reach the highest score',
      icon: Trophy,
      color: '#14B8A6' // Teal
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white flex items-center">
          <Swords className="mr-2" />
          Battle Mode
        </h3>
        <p className="text-gray-400 mt-2">
          Challenge yourself with fast-paced study sessions to reinforce your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {battleModes.map(mode => (
          <CardContainer 
            key={mode.id}
            className="p-6 flex flex-col items-center text-center h-full transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedMode(mode.id)}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${mode.color}20` }}
            >
              <mode.icon size={32} color={mode.color} />
            </div>
            <h4 className="text-white text-lg font-medium mb-2">{mode.title}</h4>
            <p className="text-gray-400 text-sm mb-6">{mode.description}</p>
            <button 
              className="mt-auto flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-white"
              style={{ backgroundColor: mode.color }}
            >
              <Play size={16} />
              <span>Start</span>
            </button>
          </CardContainer>
        ))}
      </div>

      {selectedMode === 'quickfire' && (
        <CardContainer className="mt-8 p-6">
          <h4 className="text-lg font-medium text-white mb-4">Quick Fire Mode</h4>
          <p className="text-gray-400 mb-6">
            Get ready to test your knowledge of {selectedSubject.title} in a fast-paced challenge!
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h5 className="text-white font-medium mb-4">How it works:</h5>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>You'll have 2 minutes to answer as many questions as possible</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Each correct answer earns you points</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Faster answers earn bonus points</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Try to beat your high score!</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-3 rounded-lg font-medium">
              Start Quick Fire Challenge
            </button>
          </div>
        </CardContainer>
      )}
    </div>
  );
};

export default BattleMode;