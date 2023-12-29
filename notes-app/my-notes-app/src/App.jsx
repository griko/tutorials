import React, { useState, useEffect, useRef } from 'react';


import MarkdownPane from './components/MarkdownPane';
import EditorPane from './components/EditorPane';
import EditorToolbar from './components/EditorToolbar';

import Switch from '@mui/material/Switch';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'highlight.js/styles/github-dark.css';

import './App.css';

function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [editorWidth, setEditorWidth] = useState(400);
  const [tabs, setTabs] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  // const [currentTabId, setCurrentTabId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [untitledCount, setUntitledCount] = useState(1);
  const [noteContents, setNoteContents] = useState({});
  const [tempName, setTempName] = useState(''); // Temporary name for renaming tabs

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleEditorChange = (newValue) => {
    // setMarkdownSrc(newValue);
    setNoteContents({ ...noteContents, [activeTab]: newValue });
  };

  const handleMouseDown = (e) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setEditorWidth(e.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const closeTab = (tabName) => {
    setTabs(tabs.filter(tab => tab !== tabName));
    if (activeTab === tabName) {
      setActiveTab(null);
    }
  };

  const createNewNote = () => {
    const newNote = `Untitled ${untitledCount}`;
    setIsEditing(true);
    setTabs([...tabs, newNote]);
    setActiveTab(newNote);
    setUntitledCount(untitledCount + 1);
    setNoteContents({ ...noteContents, [newNote]: '# New Note \n\n' });

    // Focus on the editor after a short delay
    setTimeout(() => {
      if (aceEditorRef.current) {
        aceEditorRef.current.editor.focus();
      }
    }, 100);
  };

  const handleDoubleClick = (tabId) => {
    setTempName(tabs.find(tab => tab === tabId)); // Set the current name as the temporary name
    setPopupVisible(true);
  };
  
  const handleRename = () => {
    if (tempName.trim() === '') {
      // If the input is empty, do nothing
      setPopupVisible(false);
      return;
    }
  
    // Check for duplicate names
    if (tabs.some(tab => tab === tempName)) {
      alert('A tab with this name already exists.');
      return;
    }
  
    // Rename the tab
    const newTabs = tabs.map(tab => tab === activeTab ? tempName : tab);
    setTabs(newTabs);
  
    // Update noteContents with the new name
    const newNoteContents = { ...noteContents };
    if (newNoteContents[activeTab]) {
      newNoteContents[tempName] = newNoteContents[activeTab];
      delete newNoteContents[activeTab];
    }
    setNoteContents(newNoteContents);
  
    // Update activeTab
    setActiveTab(tempName);
  
    // Hide the popup
    setPopupVisible(false);
  };

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const handleSaveNote = (noteName) => {
    const blob = new Blob([noteContents[noteName]], { type: 'text/markdown;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${noteName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const aceEditorRef = useRef(null);

  return (
    <div className={`App ${theme}-theme`}>
      <div className="theme-toggle">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Brightness7Icon />
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
          <Brightness3Icon />
        </div>
      </div>
      <div className="main-container">
        <div className="file-list">
          <button onClick={createNewNote}><AddIcon /> Create Note</button>
          <ul>
          {Object.keys(noteContents).map(note => (
            <li key={note} className={activeTab === note ? 'active' : ''}>
              <span onClick={() => setActiveTab(note)}>{note}</span>
              <SaveIcon onClick={() => handleSaveNote(note)} />
            </li>
          ))}
            {/* {Object.keys(noteContents).map(note => (
              <li 
                key={note} 
                onDoubleClick={() => {
                  if (!tabs.includes(note)) {
                    setTabs([...tabs, note]);
                  }
                  setActiveTab(note);
                }}
                className={activeTab === note ? 'active' : ''}
                // onClick={() => setActiveTab(note)}
              >
                {note}
              </li>
            ))} */}
          </ul>
        </div>
        <div className="editor-container">
        {activeTab && <EditorToolbar aceEditorRef={aceEditorRef} toggleEditing={toggleEditing} isEditing={isEditing} />}
          <div className="tabs">
            {tabs.map(tab => (
              <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} onDoubleClick={() => handleDoubleClick(tab)}>
                {tab}
                <CloseIcon onClick={() => closeTab(tab)} />
              </div>
            ))}
          </div>

          {isPopupVisible && (
            <div className="rename-popup">
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter new note name"
              />
              <button onClick={handleRename}>OK</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          )}

          {tabs.length > 0 && activeTab && (
            <div className="pane-container">
              {isEditing && 
                <EditorPane theme={theme} editorWidth={editorWidth} noteContents={noteContents} activeTab={activeTab} handleEditorChange={handleEditorChange} aceEditorRef={aceEditorRef} />
              }
              <div className="resize-handle" onMouseDown={handleMouseDown}></div>
              <MarkdownPane noteContents={noteContents} activeTab={activeTab} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;