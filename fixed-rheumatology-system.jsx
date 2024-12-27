
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, Copy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RheumatologySystem = () => {
  const [currentStep, setCurrentStep] = useState('input');
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    console.log('Selected file:', file); // Debugging to verify file selection
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please select a valid audio file (e.g., .mp3, .wav)');
        return;
      }
      setAudioFile(file);
      setError(null);
    }
  };

  const analyzeCaseWithLlama = async () => {
    if (!audioFile) {
      setError("Please upload an audio file before proceeding.");
      return;
    }
    setIsProcessing(true);
    try {
      // Simulating a call to a language model (Llama or others)
      const response = await fetch(
        "https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf",
        {
          headers: {
            Authorization: "Bearer YOUR_HUGGINGFACE_API_KEY",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Analyze this rheumatology case...`,
            parameters: { max_length: 2000, temperature: 0.7 },
          }),
        }
      );

      const result = await response.json();
      console.log('Analysis result:', result); // Debugging
      setAnalysis(result);
      setCurrentStep('analysis');
    } catch (err) {
      setError(`Error during analysis: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Rheumatology Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Upload Audio</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="record">Medical Record</TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {audioFile && (
                  <Button
                    onClick={analyzeCaseWithLlama}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Analyze Case'
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              {analysis && (
                <div>
                  {/* Render analysis results */}
                  <p>Analysis completed. Results are here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RheumatologySystem;
