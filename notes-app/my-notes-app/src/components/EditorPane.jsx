import React, { useEffect } from 'react';
import AceEditor from 'react-ace';

export default function EditorPane({ theme, editorWidth, noteContents, activeTab, handleEditorChange, aceEditorRef }) {
  const localRef = React.useRef(null);

  useEffect(() => {
    if (localRef.current) {
      aceEditorRef.current = localRef.current;
      console.log("Ref set in EditorPane:", aceEditorRef);
    }
  }, [localRef]);

  return (
    <div style={{ width: editorWidth }}>
      <AceEditor
        ref={localRef}
        key={theme}
        mode="markdown"
        theme={theme === 'light' ? 'github' : 'monokai'}
        value={noteContents[activeTab] || ''}
        onChange={handleEditorChange}
        name="markdownEditor"
        editorProps={{ $blockScrolling: true }}
        width={`${editorWidth}px`}
        height="100vh"
      />
    </div>
  );
}