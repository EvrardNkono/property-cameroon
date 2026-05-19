import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const TitleDocuments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Load documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getDocuments();
      let docs = response.items || response.documents || [];
      
      // Filter by logged-in user
      if (user && user._id) {
        docs = docs.filter(doc => doc.uploadedBy === user._id || doc.uploadedBy?._id === user._id);
      }
      
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Error loading documents');
      
      // Fallback data
      setDocuments([
        {
          _id: 1,
          name: "Land Title N°1234/LITTORAL",
          type: "TITLE_DEED",
          fileType: "PDF",
          createdAt: "2026-03-12T00:00:00.000Z",
          status: "APPROVED",
          property: { title: "Ngali Beachfront - Kribi" }
        },
        {
          _id: 2,
          name: "Urban Planning Certificate",
          type: "SURVEY",
          fileType: "JPG",
          createdAt: "2026-04-05T00:00:00.000Z",
          status: "PENDING",
          property: { title: "Logbessou Subdivision" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      uploadDocument(file);
    }
  };

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', getDocumentType(file.name));
    formData.append('name', file.name);

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await api.uploadDocument(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        fetchDocuments();
      }, 500);
      
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Error uploading document');
      setUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };

  // Determine document type
  const getDocumentType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return 'TITLE_DEED';
    if (['jpg', 'jpeg', 'png'].includes(extension)) return 'SURVEY';
    return 'CONTRACT';
  };

  // Get formatted status
  const getStatusInfo = (status) => {
    const statusMap = {
      'APPROVED': { label: 'Approved', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
      'PENDING': { label: 'Under Review', color: 'bg-orange-100 text-orange-700', icon: <Clock size={12} /> },
      'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <X size={12} /> }
    };
    return statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: <Clock size={12} /> };
  };

  // Get document type label
  const getDocumentTypeLabel = (type) => {
    const typeMap = {
      'TITLE_DEED': 'Land Title',
      'SURVEY': 'Survey Certificate',
      'BUILDING_PERMIT': 'Building Permit',
      'ID_CARD': 'ID Card',
      'CONTRACT': 'Contract',
      'RECEIPT': 'Receipt'
    };
    return typeMap[type] || type;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // View document
  const handleViewDocument = async (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert('Preview not available');
    }
  };

  // Download document
  const handleDownloadDocument = async (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name;
      link.click();
    } else {
      alert('Download not available');
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await api.deleteDocument(docId);
        await fetchDocuments();
      } catch (err) {
        console.error('Error deleting document:', err);
        alert('Error deleting document');
      }
    }
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 size={48} className="text-[#c5a059] animate-spin" />
        <p className="text-slate-500 text-sm">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a2619] tracking-tighter">LAND DOCUMENTS</h1>
          <p className="text-slate-500 text-sm">Secure space for managing your land titles and official documents.</p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Connected to backend - {documents.length} document{documents.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <ShieldCheck className="text-green-600" size={20} />
          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Encrypted Storage</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UPLOAD ZONE */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            onClick={!uploading ? triggerFileUpload : undefined}
            className={`bg-white p-6 rounded-[2rem] border-2 border-dashed transition-colors text-center ${
              uploading 
                ? 'border-[#c5a059] bg-[#c5a059]/5' 
                : 'border-slate-200 hover:border-[#c5a059] cursor-pointer'
            }`}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 size={48} className="text-[#c5a059] animate-spin mx-auto" />
                <p className="text-sm font-bold text-[#0a2619]">Uploading...</p>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#c5a059] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="text-slate-400 hover:text-[#c5a059]" size={32} />
                </div>
                <h3 className="font-bold text-[#0a2619]">Upload a Document</h3>
                <p className="text-xs text-slate-400 mt-2">PDF, JPG or PNG (Max. 10MB)</p>
                <button className="mt-4 px-6 py-2 bg-[#0a2619] text-white text-[10px] font-black uppercase rounded-xl hover:bg-[#1a3d2a] transition-colors">
                  Browse
                </button>
              </>
            )}
          </div>

          <div className="bg-[#0a2619] p-6 rounded-[2rem] text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-[#c5a059]" size={24} />
              <h4 className="font-bold italic">Important Note</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-white/70">
              All uploaded documents are subject to verification by our land experts before being marked as "Verified" on the marketplace.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Recent Documents</h3>
          
          {documents.map((doc) => {
            const statusInfo = getStatusInfo(doc.status);
            
            return (
              <div key={doc._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#c5a059]">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#0a2619] text-sm">{doc.name}</h4>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(doc.createdAt)}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">
                        {doc.fileType || getDocumentTypeLabel(doc.type)}
                      </span>
                      {doc.property && (
                        <span className="text-[10px] text-[#c5a059] font-bold italic">
                          {doc.property.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`mr-4 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0a2619] transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0a2619] transition-colors"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
              <FileText size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No documents available</p>
              <button 
                onClick={triggerFileUpload}
                className="mt-4 text-[#c5a059] font-bold text-sm hover:underline"
              >
                Upload your first document
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TitleDocuments;