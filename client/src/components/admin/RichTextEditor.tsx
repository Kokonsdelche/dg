import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        disabled?: boolean;
        height?: number;
        className?: string;
        error?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
        value,
        onChange,
        placeholder = 'متن خود را وارد کنید...',
        disabled = false,
        height = 300,
        className = '',
        error,
}) => {
        // Quill modules configuration
        const modules = useMemo(() => ({
                toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'align': [] }],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video'],
                        ['clean']
                ],
                clipboard: {
                        matchVisual: false,
                }
        }), []);

        // Quill formats
        const formats = [
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike',
                'color', 'background',
                'script',
                'list', 'bullet',
                'indent',
                'direction', 'align',
                'blockquote', 'code-block',
                'link', 'image', 'video'
        ];

        return (
                <div className={`space-y-2 ${className}`}>
                        <div
                                className={`
                                        border rounded-lg overflow-hidden
                                        ${error ? 'border-red-300' : 'border-gray-300'}
                                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                style={{ direction: 'rtl' }}
                        >
                                <ReactQuill
                                        value={value}
                                        onChange={onChange}
                                        modules={modules}
                                        formats={formats}
                                        placeholder={placeholder}
                                        readOnly={disabled}
                                        style={{
                                                height: `${height}px`,
                                                direction: 'rtl',
                                        }}
                                        theme="snow"
                                />
                        </div>

                        {error && (
                                <p className="text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                </p>
                        )}

                        <style>{`
                                .ql-editor {
                                        direction: rtl;
                                        text-align: right;
                                        font-family: 'Vazirmatn', sans-serif;
                                }
                                .ql-toolbar {
                                        direction: ltr;
                                }
                        `}</style>
                </div>
        );
};

export default RichTextEditor; 