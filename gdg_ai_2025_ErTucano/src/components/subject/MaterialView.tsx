import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CardContainer from '../common/CardContainer';
import MaterialItem from './MaterialItem';
import MaterialViewer from './MaterialViewer';
import { PlusCircle, Filter } from 'lucide-react';
import IconButton from '../common/IconButton';

const MaterialView: React.FC = () => {
  const { selectedSubject, selectedMaterial } = useAppContext();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (!selectedSubject) return null;
  
  // Flatten all materials from all chapters
  const allMaterials = selectedSubject.chapters.flatMap(chapter => 
    chapter.materials.map(material => ({
      ...material,
      chapterTitle: chapter.title
    }))
  );
  
  // Filter by type if selected
  const filteredMaterials = selectedType 
    ? allMaterials.filter(m => m.type === selectedType)
    : allMaterials;

  // Get unique material types
  const materialTypes = [...new Set(allMaterials.map(m => m.type))];

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleTypeSelect = (type: string | null) => {
    setSelectedType(type);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-white">
            Study Materials
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <IconButton 
                icon={Filter} 
                label="Filter"
                className="mr-2"
                onClick={handleFilterClick}
              />
              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute top-12 right-0 z-20 bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col space-y-1 border border-gray-700 min-w-32">
                    <button 
                      className={`text-left text-sm px-3 py-1.5 rounded ${
                        selectedType === null ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => handleTypeSelect(null)}
                    >
                      All Types
                    </button>
                    {materialTypes.map(type => (
                      <button
                        key={type}
                        className={`text-left text-sm px-3 py-1.5 rounded capitalize ${
                          selectedType === type ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => handleTypeSelect(type)}
                      >
                        {type}s
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white px-3 py-2 rounded-lg text-sm">
              <PlusCircle size={16} />
              <span>Add Material</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <MaterialItem 
              key={material.id} 
              material={material} 
            />
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <CardContainer className="py-12 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">No materials found for this filter</p>
            <button 
              className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-4 py-2 rounded-lg"
              onClick={() => handleTypeSelect(null)}
            >
              Show All Materials
            </button>
          </CardContainer>
        )}
      </div>
      
      {selectedMaterial && <MaterialViewer />}
    </div>
  );
};

export default MaterialView;