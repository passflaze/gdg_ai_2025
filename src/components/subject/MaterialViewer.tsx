import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { X, CheckCircle, XCircle } from "lucide-react";
import IconButton from "../common/IconButton";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const sampleQuestion = {
  text: "The CNS is where the information is sorted",
  correctAnswer: true,
};

const MaterialViewer: React.FC = () => {
  const { selectedMaterial, setSelectedMaterial } = useAppContext();
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMaterial) {
      setPageNumber(1);
      setNumPages(null);
      setShowQuestion(false);
      setUserAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
      setPdfError(null);
    }
  }, [selectedMaterial]);

  if (!selectedMaterial || selectedMaterial.type !== "textbook") return null;

  const handleClose = () => {
    setSelectedMaterial(null);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setPdfError("Error loading PDF. Please try again later.");
  };

  const handleAnswer = (answer: boolean) => {
    const correct = answer === sampleQuestion.correctAnswer;
    setIsCorrect(correct);
    setUserAnswer(answer);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setShowQuestion(false);
      setUserAnswer(null);
      setIsCorrect(null);
    }, 2000);
  };

  return (
    <div className="w-1/2 border-l border-gray-800 flex flex-col relative">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h3 className="text-lg font-medium text-white">
            {selectedMaterial.title}
          </h3>
          {numPages && (
            <p className="text-sm text-gray-400">
              Page {pageNumber} of {numPages}
            </p>
          )}
        </div>
        <IconButton icon={X} onClick={handleClose} label="Close viewer" />
      </div>

      <div className="flex-1 bg-gray-900 overflow-auto p-4">
        <div className="flex flex-col items-center">
          {pdfError ? (
            <div className="text-red-400 p-4">{pdfError}</div>
          ) : (
            <Document
              file="textbook1.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="text-white">Loading PDF...</div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.2}
                className="max-w-full"
              />
            </Document>
          )}
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p))
            }
            disabled={!numPages || pageNumber >= numPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowQuestion(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Test it!
          </button>
        </div>

        {showQuestion && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg p-6 w-96 z-50">
            <h4 className="text-white font-medium mb-2">True or False?</h4>
            <p className="text-gray-300 mb-4">{sampleQuestion.text}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                False
              </button>
            </div>
          </div>
        )}

        {showFeedback && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-4">
            <div
              className={`px-6 py-4 rounded-lg text-white shadow-lg flex items-center space-x-2 ${
                isCorrect ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {isCorrect ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
              <span className="text-lg font-medium">
                {isCorrect ? "Correct!" : "Wrong!"}
              </span>
            </div>
            <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Memory updated</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialViewer;