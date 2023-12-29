import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';


export default function MarkdownPane({ noteContents, activeTab }) {
    return (
        <ReactMarkdown children={noteContents[activeTab] || ''} rehypePlugins={[rehypeHighlight, remarkGfm]} className="markdown-pane" />
    );
  }