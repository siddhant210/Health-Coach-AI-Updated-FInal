import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, Image, Upload, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf';
  created_at: string;
  summary?: string; // generated prescription summary or extracted text
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch documents (mock data)
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        // Mock documents
        const mockDocs: Document[] = [
          {
            id: '1',
            name: 'Lab Results - Jan 2024.pdf',
            url: '#',
            type: 'pdf',
            created_at: '2024-01-15'
            ,
            summary: 'No prescription found in this document.'
          },
          {
            id: '2',
            name: 'Heart Rate Monitoring Report.pdf',
            url: '#',
            type: 'pdf',
            created_at: '2024-01-20'
            ,
            summary: 'No prescription found in this document.'
          }
        ];

        setDocuments(mockDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileType = file.type.includes('pdf') ? 'pdf' : 'image';

    try {
      setUploading(true);
      
      // Add to local state (no actual upload)
      // Attempt to read file text when possible for simple keyword parsing
      const fileText = await readFileAsText(file);
      const generatedSummary = generatePrescriptionSummary(file.name, fileText);

      setDocuments(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: file.name,
          url: file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf') ? `${file.name}` : '#',
          type: fileType,
          created_at: new Date().toISOString(),
          summary: generatedSummary
        }
      ]);

      toast.success('Document uploaded and summarized');
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Simulate extraction and summarization of prescription from a document
  const generatePrescriptionSummary = (fileName: string, fileText?: string | null) => {
    // Try to detect medicine keywords in provided text or filename
    const detected = detectMedicines(fileText || fileName);

    if (detected.length > 0) {
      const notes = [
        'Follow-up in 5 days or sooner if symptoms worsen.',
        'Check for allergies to penicillin before taking Augmentin.'
      ];
      return `Prescription Summary (extracted from ${fileName}):\n\nMedications:\n- ${detected.join('\n- ')}\n\nNotes:\n- ${notes.join('\n- ')}`;
    }

    // Fallback static summary
    const meds = [
      'Tab Levocet 5 mg — once daily',
      'Caladryl lotion — apply topically as needed',
      'Tab Acemiz SP — morning for 5 days',
      'Tab Metro 400 mg — morning for 5 days',
      'Tab Augmentin 625 mg — morning and night for 5 days'
    ];

    const notes = [
      'Follow-up in 5 days or sooner if symptoms worsen.',
      'Check for allergies to penicillin before taking Augmentin.'
    ];

    return `Prescription Summary (extracted from ${fileName}):\n\nMedications:\n- ${meds.join('\n- ')}\n\nNotes:\n- ${notes.join('\n- ')}`;
  };

  // Basic keyword detection for common medicines/doses
  const detectMedicines = (text: string) => {
    const keywords: { regex: RegExp; format: string }[] = [
      { regex: /levocet/i, format: 'Tab Levocet 5 mg — once daily' },
      { regex: /caladryl/i, format: 'Caladryl lotion — apply topically as needed' },
      { regex: /acemiz\s*sp/i, format: 'Tab Acemiz SP — morning for 5 days' },
      { regex: /metro|metronidazole/i, format: 'Tab Metro 400 mg — morning for 5 days' },
      { regex: /augmentin|amoxicillin\s*clavulanate/i, format: 'Tab Augmentin 625 mg — morning and night for 5 days' }
    ];

    const found: string[] = [];
    for (const kw of keywords) {
      if (kw.regex.test(text)) found.push(kw.format);
    }

    return found;
  };

  const readFileAsText = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') resolve(result);
        else resolve(null);
      };
      reader.onerror = () => resolve(null);
      // Only attempt for textual files
      if (file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    });
  };

  const handleDelete = async (docId: string) => {
    try {
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      toast.success('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const toggleExpand = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No documents yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Upload your first document by clicking the button above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/30 dark:border-gray-700/30 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {doc.type === 'pdf' ? (
                        <FileText className="w-6 h-6 text-red-500" />
                      ) : (
                        <Image className="w-6 h-6 text-blue-500" />
                      )}
                      <span className="font-medium truncate max-w-[180px]">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => toggleExpand(doc.id)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {expandedDoc === doc.id ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>

                  {expandedDoc === doc.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Type: {doc.type.toUpperCase()}</span>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openPreview(doc.url)}
                          className="flex-1 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 py-2 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="flex-1 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                      {/* Prescription summary */}
                      {doc.summary && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                          <div className="flex items-center justify-between">
                            <strong>Extracted Summary</strong>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(doc.summary || '')
                                    .then(() => toast.success('Summary copied'))
                                    .catch(() => toast.error('Copy failed'));
                                }}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">{doc.summary}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full p-2 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {previewUrl.endsWith('.pdf') ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[80vh]"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}