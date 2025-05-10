import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { X, BrainCog, CheckCircle } from 'lucide-react';
import IconButton from '../common/IconButton';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface Question {
  page: number;
  text: string;
  answer?: string;
}

const questions: Question[] = [
  {
    page: 2,
    text: "Define a vector. How is it different from a scalar, and how can vectors be represented geometrically?"
  },
  {
    page: 3,
    text: "What are the different types of vectors discussed in the text, and how is a unit vector different from a null vector?"
  },
  {
    page: 5,
    text: "How can vectors be represented in economic contexts? Give an example involving consumption of goods."
  },
  {
    page: 6,
    text: "Explain the process of adding two vectors. What conditions must be met for vector addition to be valid?"
  },
  {
    page: 7,
    text: "What does scalar multiplication of a vector mean? Describe how multiplying a vector by a negative scalar affects its direction."
  },
  {
    page: 8,
    text: "List and explain the properties of vector addition and scalar multiplication. Include at least two properties from each operation."
  }
];

const MaterialViewer: React.FC = () => {
  const { selectedMaterial, setSelectedMaterial } = useAppContext();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [showMemoryUpdate, setShowMemoryUpdate] = useState(false);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(null);
    setError(null);
    setIsLoading(true);
  }, [selectedMaterial]);

  useEffect(() => {
    const question = questions.find(q => q.page === pageNumber);
    if (question) {
      setCurrentQuestion(question);
    }
  }, [pageNumber]);

  if (!selectedMaterial) return null;

  const handleClose = () => {
    setSelectedMaterial(null);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Failed to load the PDF. Please try again later.');
    setIsLoading(false);
  }

  const handleSubmitAnswer = () => {
    setShowWrongAnswer(true);
    setTimeout(() => {
      setShowWrongAnswer(false);
      setShowMemoryUpdate(true);
      setTimeout(() => {
        setShowMemoryUpdate(false);
        setShowQuestion(false);
        setUserAnswer('');
      }, 1500);
    }, 2000);
  };

  const pdfUrl = 'src/data/vector_and_spaces_1.pdf';

  return (
    <div className="w-1/2 border-l border-gray-800 flex flex-col relative">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h3 className="text-lg font-medium text-white">{selectedMaterial.title}</h3>
          {numPages && (
            <p className="text-sm text-gray-400">
              Page {pageNumber} of {numPages}
            </p>
          )}
        </div>
        <IconButton 
          icon={X} 
          onClick={handleClose}
          label="Close viewer"
        />
      </div>

      {/* PDF Container */}
      <div className="flex-1 bg-gray-900 overflow-auto p-4 relative">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse text-gray-400">Loading PDF...</div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-64">
                  <p className="text-red-400">Failed to load PDF</p>
                </div>
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse text-gray-400">Loading page...</div>
                </div>
              ) : (
                <Page
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  className="max-w-full"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.2}
                />
              )}
            </Document>
          </div>
        )}

        {/* Attention Keeper - Now positioned relative to PDF container */}
        {currentQuestion && !showQuestion && (
          <div 
            className="fixed top-20 right-8 bg-purple-600/20 backdrop-blur-sm rounded-lg p-2 cursor-pointer hover:bg-purple-600/30 transition-all duration-300 flex items-center gap-2 z-50"
            onClick={() => setShowQuestion(true)}
          >
            <BrainCog className="text-purple-400" size={20} />
            <span className="text-purple-300 text-sm">Knowledge Check</span>
          </div>
        )}

        {/* Question Dialog - Now positioned relative to PDF container */}
        {showQuestion && currentQuestion && (
          <div className="fixed top-20 right-8 bg-gray-800 rounded-lg shadow-xl w-96 z-50">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-white">Question</h4>
                <button
                  onClick={() => setShowQuestion(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-200 mb-4">{currentQuestion.text}</p>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4"
                rows={4}
                placeholder="Type your answer here..."
              />
              <button
                onClick={handleSubmitAnswer}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Wrong Answer Popup */}
        {showWrongAnswer && (
          <div className="fixed top-20 right-8 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            Wrong answer
          </div>
        )}

        {/* Memory Update Popup */}
        {showMemoryUpdate && (
          <div className="fixed top-20 right-8 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 z-50">
            <CheckCircle size={16} />
            <span>Memory updated</span>
          </div>
        )}
      </div>

      {numPages && (
        <div className="p-4 border-t border-gray-800 flex justify-center space-x-4">
          <button
            onClick={() => setPageNumber(page => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MaterialViewer;