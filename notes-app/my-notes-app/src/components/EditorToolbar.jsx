import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinkIcon from '@mui/icons-material/Link';
import { useRef, useEffect } from 'react';
  
  
  

export default function EditorToolbar({ aceEditorRef, toggleEditing, isEditing }) {
    // let aceEditorRef = aceEditorRefAsProp // useRef(null);
    // useEffect(() => {
    //     aceEditorRef.current = aceEditorRefAsProp;
    // }, [aceEditorRefAsProp]);
    useEffect(() => {
        console.log('aceEditorRef has changed:', aceEditorRef);
    }, [aceEditorRef]);

    const wrapText = (before, after) => {
        const editor = aceEditorRef.current.editor;
        const selectedText = editor.getSelectedText();
        let { start, end } = editor.getSelectionRange();
      
        // Handle multiple paragraphs
        const wrappedText = selectedText.split('\n').map(paragraph => (paragraph.trim() != '')?before + paragraph + after:paragraph).join('\n');
      
        editor.session.replace(editor.getSelectionRange(), wrappedText);
        start['column'] += before.length;
        end['column'] += before.length;
        editor.getSelection().setSelectionRange({ start, end }, false);
        editor.focus();
      };
    
      const indentText = () => {
        const editor = aceEditorRef.current.editor;
        const { start, end } = editor.getSelectionRange();
        const newStart = { row: start.row, column: 0 };
        editor.getSelection().setSelectionRange({ start: newStart, end }, false);
        const selectedText = editor.getSelectedText();
      
        let newEnd = { row: end.row, column: end.column };
      
        if (selectedText && selectedText.includes('\n')) {
          // Add two spaces at the beginning of each line
          const indentedText = selectedText.split('\n').map(line => '  ' + line).join('\n');
          editor.session.replace(editor.getSelectionRange(), indentedText);
          newEnd = { row: end.row, column: end.column + 2 * selectedText.split('\n').length };
        } else {
          // No text selected, indent the current line
          editor.session.insert({ row: start.row, column: 0 }, '  ');
          newEnd = { row: end.row, column: end.column + 2 };
        }
      
        editor.getSelection().setSelectionRange({ start, end: newEnd }, false);
        editor.focus();
      };
      
      const deIndentText = () => {
        const editor = aceEditorRef.current.editor;
        let selectedText = editor.getSelectedText();
        const { start, end } = editor.getSelectionRange();
      
        let newEnd = { row: end.row, column: end.column };
      
        if (selectedText && selectedText.includes('\n')) {
          const newStart = { row: start.row, column: 0 };
          editor.getSelection().setSelectionRange({ start: newStart, end }, false);
          selectedText = editor.getSelectedText();
          // Remove two spaces from the beginning of each line, if present
          const deIndentedText = selectedText.split('\n').map(line => line.startsWith('  ') ? line.substring(2) : line).join('\n');
          editor.session.replace(editor.getSelectionRange(), deIndentedText);
          newEnd = { row: end.row, column: end.column - 2 * selectedText.split('\n').filter(line => line.startsWith('  ')).length };
        } else {
          // No text selected, de-indent the current line if it starts with two spaces
          const lines = editor.session.getDocument().getAllLines();
          const currentLine = lines[start.row] || '';
          if (currentLine.startsWith('  ')) {
            editor.session.replace({ start: { row: start.row, column: 0 }, end: { row: start.row, column: 2 } }, '');
            newEnd = { row: end.row, column: end.column - 2 };
          }
        }
      
        editor.getSelection().setSelectionRange({ start, end: newEnd }, false);
        editor.focus();
      };
    
      const toggleWrapText = (before, after) => {
        const editor = aceEditorRef.current.editor;
        const selectedText = editor.getSelectedText();
        const { start, end } = editor.getSelectionRange();
      
        // Split the selected text into lines
        const lines = selectedText.split('\n');
        
        // Check if all lines are wrapped
        const allWrapped = lines.every(line =>  (line.trim() != '')?line.startsWith(before) && line.endsWith(after):true);
      
        let wrappedText;
        let newStart = { row: start.row, column: start.column };
        let newEnd = { row: end.row, column: end.column };
      
        if (allWrapped) {
          // Unwrap all lines
          wrappedText = lines.map(line => (line.trim() != '')?line.substring(before.length, line.length - after.length):line).join('\n');
          newEnd = { row: end.row, column: end.column - after.length - before.length };
        } else {
          // Wrap all lines
          wrappedText = lines.map(line => (line.trim() != '')?before + line + after:line).join('\n');
          newEnd = { row: end.row, column: end.column + (before.length + after.length) * lines.length };
        }
      
        editor.session.replace({ start, end }, wrappedText);
        editor.getSelection().setSelectionRange({ start: newStart, end: newEnd }, false);
        editor.focus();
      };
      
      const insertList = (marker) => {
        const editor = aceEditorRef.current.editor;
        let selectedText = editor.getSelectedText();
        let { start, end } = editor.getSelectionRange();
      
        const lines = editor.session.getLines(start.row, end.row);
        
        // Check if all lines are already lists
        const allListed = lines.every(line => {
          const trimmed = line.trim();
          if (trimmed === '') return true;
          if (marker === '1. ') {
            return /^\d+\.\s/.test(trimmed);
          }
          return trimmed.startsWith(marker);
        });
      
        let listText;
        let newEnd = { row: end.row, column: end.column };
      
        if (allListed) {
          // Remove list markers
          listText = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed === '') return line;
            if (marker === '1. ') {
              return line.replace(/^\d+\.\s/, '');
            }
            return line.substring(marker.length);
          }).join('\n');
          newEnd = { row: end.row, column: end.column - marker.length };
        } else {
          // Add list markers
          if (marker === '1. ') {
            listText = lines.map((line, index) => (line.trim() !== '') ? `${index + 1}. ${line}` : line).join('\n');
          } else {
            listText = lines.map(line => (line.trim() !== '') ? `${marker}${line}` : line).join('\n');
          }
          newEnd = { row: end.row, column: end.column + marker.length * lines.length };
        }
      
        start.column = 0;
        editor.session.replace({ start, end }, listText);
        editor.getSelection().setSelectionRange({ start, end: newEnd }, false);
        editor.focus();
      };

      const insertCheckbox = (isChecked) => {
        const editor = aceEditorRef.current.editor;
        let { start, end } = editor.getSelectionRange();
      
        const marker = isChecked ? "- [x] " : "- [ ] ";
        const oppositeMarker = isChecked ? "- [ ] " : "- [x] ";
      
        // Make sure the selection starts at the beginning of the first line
        start.column = 0;
        end.column = editor.session.getLine(end.row).length;
      
        // Get the text from the beginning of the first line to the end of the last line
        const selectedText = editor.session.getTextRange({ start, end });
      
        // Split the selected text into lines
        const lines = selectedText.split('\n');
      
        let checkboxText = '';
        let newEndColumn = end.column;
      
        // Loop through each line to handle different scenarios
        lines.forEach((line, index) => {
          const trimmed = line.trim();
      
          if (trimmed.startsWith(marker)) {
            // Remove existing marker
            checkboxText += line.substring(marker.length) + '\n';
            newEndColumn -= marker.length;
          } else if (trimmed.startsWith(oppositeMarker)) {
            // Replace opposite marker
            checkboxText += line.replace(oppositeMarker, marker) + '\n';
          } else {
            // Add new marker
            checkboxText += marker + line + '\n';
            newEndColumn += marker.length;
          }
        });
      
        // Remove the trailing newline added in the loop
        checkboxText = checkboxText.slice(0, -1);
      
        editor.session.replace({ start, end }, checkboxText);
        editor.getSelection().setSelectionRange({ start, end: { row: end.row, column: newEndColumn } }, false);
        editor.focus();
      };

    return (
        <div className="toolbar">
        <button onClick={() => toggleWrapText("**", "**")}><FormatBoldIcon /></button>
        <button onClick={() => toggleWrapText("*", "*")}><FormatItalicIcon /></button>
        <button onClick={() => indentText()}><FormatIndentIncreaseIcon /></button>
        <button onClick={() => deIndentText()}><FormatIndentDecreaseIcon /></button>
        <button onClick={() => insertList("- ")}><FormatListBulletedIcon /></button>
        <button onClick={() => insertList("1. ")}><FormatListNumberedIcon /></button>
        <button onClick={() => wrapText("[", "](url)")}><LinkIcon /></button>
        <button onClick={() => insertCheckbox(false)}><CheckBoxOutlineBlankIcon /></button>
        <button onClick={() => insertCheckbox(true)}><CheckBoxIcon /></button>
        <button onClick={toggleEditing}>
            {isEditing ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </button>
      </div>
    );
  }