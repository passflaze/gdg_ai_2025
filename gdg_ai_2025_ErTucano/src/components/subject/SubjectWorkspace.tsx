import React from 'react';
import { useAppContext } from '../../context/AppContext';
import TabNavigation from './TabNavigation';
import GraphView from './GraphView';
import MaterialView from './MaterialView';
import BattleMode from './BattleMode';

const SubjectWorkspace: React.FC = () => {
  const { selectedSubject, activeTab } = useAppContext();

  if (!selectedSubject) return null;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'graph':
        return <GraphView />;
      case 'material':
        return <MaterialView />;
      case 'battle':
        return <BattleMode />;
      default:
        return <GraphView />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TabNavigation />
      <div className="flex-grow overflow-y-auto">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default SubjectWorkspace;