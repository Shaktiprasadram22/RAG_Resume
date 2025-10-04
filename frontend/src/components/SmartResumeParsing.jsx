import React, { useState } from 'react';
import { uploadResume } from '../api/api';
import { useAuth } from '../context/AuthContext';

/**
 * SmartResumeParsing Component
 * Allows users to upload resumes (PDF/DOCX) and preview the parsed text
 */
const SmartResumeParsing = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(false);
      setPreviewText(`File: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type}\n\n[Upload and parse to see extracted content...]`);
    }
  };

  // Handle file upload submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file first!');
      return;
    }

    if (!user) {
      setError('Please log in to upload a resume');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare user information
      const userInfo = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      };

      // Upload and parse resume via API
      const response = await uploadResume(selectedFile, userInfo);
      
      if (response.success) {
        const summary = response.data.summary;
        
        // Display parsed information
        setPreviewText(
          `Resume Parsed Successfully!\n\n` +
          `Uploaded by: ${user.name}\n` +
          `Name (from resume): ${summary.name}\n` +
          `Email: ${summary.email || 'Not found'}\n` +
          `Phone: ${summary.phone || 'Not found'}\n` +
          `Skills Found: ${summary.skillCount}\n` +
          `Top Skills: ${summary.topSkills.join(', ')}\n` +
          `Education Entries: ${summary.educationCount}\n` +
          `Word Count: ${summary.wordCount}\n\n` +
          `Resume ID: ${response.data.id}`
        );
        
        setSuccess(true);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="resume-parsing" className="section">
      <div className="section-header">
        <h2 className="section-title">Smart Resume Parsing</h2>
        <p className="section-subtitle">Upload and parse resumes automatically with AI</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Upload Resume</h3>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* File Upload Zone */}
            <div 
              className="file-upload-zone" 
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <div className="file-upload-text">
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </div>
              <div className="file-upload-hint">
                Supports PDF, DOCX (Max 10MB)
              </div>
              <input
                id="resume-upload"
                type="file"
                className="file-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
              />
            </div>

            {/* Preview Text Area */}
            {selectedFile && (
              <div className="input-group mt-2">
                <label className="input-label">Preview</label>
                <textarea
                  className="textarea"
                  value={previewText}
                  readOnly
                  rows="8"
                  placeholder="Parsed resume text will appear here..."
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-1" style={{ 
                padding: 'var(--spacing-md)', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--color-error)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error)'
              }}>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-1" style={{ 
                padding: 'var(--spacing-md)', 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-success)'
              }}>
                Resume uploaded and parsed successfully!
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary mt-1" disabled={loading}>
              {loading ? 'Parsing...' : 'Parse Resume'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SmartResumeParsing;
