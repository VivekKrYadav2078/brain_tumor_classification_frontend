'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Brain, Activity, AlertCircle, CheckCircle, X, Thermometer } from 'lucide-react';

export default function BrainTumorDetector() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    predicted_class: string;
    confidence: number;
    // details: string;
    heatmap: string;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);

      // For preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
// https://unseconded-mirna-demiurgically.ngrok-free.dev
// http://localhost:8000/predict
      const response = await fetch("https://unseconded-mirna-demiurgically.ngrok-free.dev/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Expected backend response format
      // { classification: "Glioma", confidence: 92.4, details: "...", heatmap: "data:image/png;base64,..." }

      setResult({
        predicted_class: data.predicted_class,
        confidence: data.confidence,
        // details: data.details,
        heatmap: data.heatmap,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Navbar */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BrainSight AI</h1>
              <p className="text-xs text-purple-300">Brain Tumor Detection System</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex-1 p-6 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload MRI Scan
            </h2>
            <p className="text-sm text-purple-300">
              Upload a brain MRI image for classification
            </p>
          </div>

          <label className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center hover:border-purple-400 transition-colors bg-slate-900/30 group-hover:bg-slate-900/50">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Click to upload</p>
              <p className="text-sm text-purple-300">PNG, JPG up to 10MB</p>
            </div>
          </label>

          {selectedImage && (
            <div className="mt-6 space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-purple-500/30">
                <img 
                  src={previewImage || undefined} 
                  alt="Uploaded MRI" 
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze Image
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-purple-500/20">
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-purple-200">
                  This is a demo system. Always consult healthcare professionals for medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Detection Results</h2>
            <p className="text-purple-300">AI-powered brain tumor classification with activation heatmap</p>
          </div>

          {!selectedImage && !result && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="p-6 bg-purple-900/20 rounded-full mb-6">
                <Brain className="w-20 h-20 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No Image Selected</h3>
              <p className="text-purple-300 max-w-md">
                Upload an MRI scan from the left panel to begin the analysis process
              </p>
            </div>
          )}

          {selectedImage && !result && !isAnalyzing && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 text-center">
              <img 
                src={previewImage || undefined} 
                alt="MRI Preview" 
                className="max-w-md mx-auto rounded-lg border-2 border-purple-500/30 mb-6"
              />
              <p className="text-purple-300">Click "Analyze Image" to start classification</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-12 text-center">
              <Activity className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-spin" />
              <h3 className="text-xl font-semibold text-white mb-3">Analyzing Image...</h3>
              <p className="text-purple-300 mb-2">Processing MRI scan through neural network</p>
              <p className="text-sm text-purple-400">Generating activation heatmap...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                <div className="flex items-start gap-4 mb-6">
                  {/* <div className={`p-4 rounded-xl ${result.classification === 'No Tumor' ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                    {result.classification === 'No Tumor' ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-purple-400" />
                    )}
                  </div> */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Classification Result</h3>
                    <p className="text-purple-300">Analysis completed successfully</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
                    <p className="text-sm text-purple-300 mb-2">Detected Type</p>
                    <p className="text-2xl font-bold text-white">{result.predicted_class}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
                    <p className="text-sm text-purple-300 mb-2">Confidence Level</p>
                    <p className="text-2xl font-bold text-white"><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
                  </div>
                </div>
                {/*  
                <div className="mt-6 bg-slate-900/50 rounded-xl p-6 border border-purple-500/20">
                  <p className="text-sm text-purple-300 mb-2">Analysis Details</p>
                  
                
                
                */}
                
              </div>
              {/* Heatmap Visualization */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Thermometer className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Activation Heatmap</h3>
                    <p className="text-sm text-purple-300">Neural network attention visualization</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-purple-300 mb-3 font-medium">Original MRI Scan</p>
                    <div className="rounded-lg overflow-hidden border-2 border-purple-500/30">
                      <img 
                        src={previewImage || undefined} 
                        alt="Original MRI" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-purple-300 mb-3 font-medium">Heatmap Overlay</p>
                    <div className="rounded-lg overflow-hidden border-2 border-red-500/50">
                      <img 
                        src={`data:image/png;base64,${result.heatmap}`}
                        alt="Activation Heatmap" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 bg-slate-900/50 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-4 rounded bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500"></div>
                    <span className="text-xs text-purple-300">Low → High Activation</span>
                  </div>
                  <p className="text-sm text-purple-300 flex-1">
                    Red regions indicate areas of high neural network activation where potential abnormalities were detected.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold text-white">Important Notice</h4>
                </div>
                <p className="text-sm text-purple-300">
                  This AI-powered system is designed to assist medical professionals and should not be used as the sole basis for diagnosis. The heatmap shows model attention areas but does not constitute a definitive diagnostic tool. Always consult with qualified healthcare providers for proper medical evaluation and treatment recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}