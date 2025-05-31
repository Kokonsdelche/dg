import React, { useRef, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

interface JSONEditorProps {
        value: any;
        onChange: (value: any) => void;
        onValidate?: (isValid: boolean, errors?: string[]) => void;
        height?: number;
        readOnly?: boolean;
        theme?: 'light' | 'dark';
        showValidation?: boolean;
        placeholder?: string;
        className?: string;
        error?: string;
}

const JSONEditor: React.FC<JSONEditorProps> = ({
        value,
        onChange,
        onValidate,
        height = 400,
        readOnly = false,
        theme = 'light',
        showValidation = true,
        placeholder = '{\n  "key": "value"\n}',
        className = '',
        error,
}) => {
        const [jsonString, setJsonString] = useState<string>('');
        const [validationErrors, setValidationErrors] = useState<string[]>([]);
        const [isValid, setIsValid] = useState<boolean>(true);
        const editorRef = useRef<any>(null);

        // Convert object to formatted JSON string
        useEffect(() => {
                try {
                        const formatted = JSON.stringify(value, null, 2);
                        setJsonString(formatted);
                } catch (err) {
                        setJsonString(placeholder);
                }
        }, [value, placeholder]);

        // Validate JSON
        const validateJSON = (jsonStr: string) => {
                try {
                        if (!jsonStr.trim()) {
                                setValidationErrors([]);
                                setIsValid(true);
                                return null;
                        }

                        const parsed = JSON.parse(jsonStr);
                        setValidationErrors([]);
                        setIsValid(true);
                        onValidate?.(true);
                        return parsed;
                } catch (err: any) {
                        const errorMessage = err.message || 'Invalid JSON format';
                        setValidationErrors([errorMessage]);
                        setIsValid(false);
                        onValidate?.(false, [errorMessage]);
                        return null;
                }
        };

        // Handle editor changes
        const handleChange = (newValue: string) => {
                setJsonString(newValue);

                // Debounce validation and onChange
                const timeoutId = setTimeout(() => {
                        const parsed = validateJSON(newValue);
                        if (parsed !== null) {
                                onChange(parsed);
                        }
                }, 300);

                return () => clearTimeout(timeoutId);
        };

        // Format JSON
        const formatJSON = () => {
                try {
                        const parsed = JSON.parse(jsonString);
                        const formatted = JSON.stringify(parsed, null, 2);
                        setJsonString(formatted);
                        onChange(parsed);
                } catch (err) {
                        // JSON is invalid, don't format
                }
        };

        // Minify JSON
        const minifyJSON = () => {
                try {
                        const parsed = JSON.parse(jsonString);
                        const minified = JSON.stringify(parsed);
                        setJsonString(minified);
                        onChange(parsed);
                } catch (err) {
                        // JSON is invalid, don't minify
                }
        };

        // Copy to clipboard
        const copyToClipboard = async () => {
                try {
                        await navigator.clipboard.writeText(jsonString);
                } catch (err) {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = jsonString;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                }
        };

        return (
                <div className={`space-y-3 ${className}`}>
                        {/* Toolbar */}
                        {!readOnly && (
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-t-lg border border-b-0 border-gray-300">
                                        <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">JSON Editor</span>
                                                {showValidation && (
                                                        <div className="flex items-center gap-1">
                                                                {isValid ? (
                                                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                                معتبر
                                                                        </span>
                                                                ) : (
                                                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                                نامعتبر
                                                                        </span>
                                                                )}
                                                        </div>
                                                )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                                <button
                                                        onClick={formatJSON}
                                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                        disabled={!isValid}
                                                >
                                                        فرمت
                                                </button>
                                                <button
                                                        onClick={minifyJSON}
                                                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                                        disabled={!isValid}
                                                >
                                                        فشرده
                                                </button>
                                                <button
                                                        onClick={copyToClipboard}
                                                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                                >
                                                        کپی
                                                </button>
                                        </div>
                                </div>
                        )}

                        {/* Editor */}
                        <div className={`border rounded-lg overflow-hidden ${error || (!isValid && showValidation) ? 'border-red-300' : 'border-gray-300'}`}>
                                <AceEditor
                                        ref={editorRef}
                                        mode="json"
                                        theme={theme === 'dark' ? 'monokai' : 'github'}
                                        value={jsonString}
                                        onChange={handleChange}
                                        width="100%"
                                        height={`${height}px`}
                                        readOnly={readOnly}
                                        fontSize={14}
                                        showPrintMargin={false}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: true,
                                                enableSnippets: true,
                                                showLineNumbers: true,
                                                tabSize: 2,
                                                useWorker: false,
                                                wrap: true,
                                        }}
                                        editorProps={{
                                                $blockScrolling: true,
                                        }}
                                        style={{
                                                fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                                                direction: 'ltr',
                                        }}
                                />
                        </div>

                        {/* Validation Errors */}
                        {showValidation && validationErrors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <h4 className="text-sm font-medium text-red-800 mb-2">خطاهای اعتبارسنجی:</h4>
                                        <ul className="space-y-1">
                                                {validationErrors.map((error, index) => (
                                                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                                                                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>{error}</span>
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                        )}

                        {/* General Error */}
                        {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-red-700">{error}</span>
                                        </div>
                                </div>
                        )}

                        {/* Usage Tips */}
                        {!readOnly && (
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                        <h5 className="font-medium mb-1">راهنمای استفاده:</h5>
                                        <ul className="space-y-1">
                                                <li>• برای فرمت کردن JSON از دکمه "فرمت" استفاده کنید</li>
                                                <li>• برای فشرده کردن JSON از دکمه "فشرده" استفاده کنید</li>
                                                <li>• JSON شما به صورت خودکار اعتبارسنجی می‌شود</li>
                                                <li>• Ctrl+Space برای تکمیل خودکار</li>
                                        </ul>
                                </div>
                        )}
                </div>
        );
};

export default JSONEditor; 