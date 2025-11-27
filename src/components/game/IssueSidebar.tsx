import React, { useState } from 'react';
import { Plus, Check, ChevronRight, ChevronLeft, Trash2, Download } from 'lucide-react';
import { type Issue } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface IssueSidebarProps {
    issues: Issue[];
    currentIssueId: string | null;
    onAddIssue: (title: string, description?: string) => void;
    onSelectIssue: (issueId: string) => void;
    onMarkEstimated: (issueId: string, estimate: string) => void;
    onDeleteIssue: (issueId: string) => void;
    onImportCSV: (csvText: string) => void;
    onExportCSV: () => void;
    isHost: boolean;
}

export const IssueSidebar: React.FC<IssueSidebarProps> = ({
    issues,
    currentIssueId,
    onAddIssue,
    onSelectIssue,
    onDeleteIssue,
    onExportCSV,
    isHost,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [newIssueDescription, setNewIssueDescription] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddIssue = () => {
        if (newIssueTitle.trim()) {
            onAddIssue(newIssueTitle, newIssueDescription);
            setNewIssueTitle('');
            setNewIssueDescription('');
            setShowAddForm(false);
        }
    };



    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-0 top-1/2 -translate-y-1/2 glass px-2 py-4 rounded-l-xl z-30 hover:bg-white/10 transition-all"
            >
                {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-80 glass-strong p-4 transform transition-transform duration-300 z-20 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold gradient-text">Issues</h3>
                    <div className="flex gap-2">
                        {isHost && (
                            <>
                                {/* <button
                                    onClick={handleImportClick}
                                    className="p-2 glass rounded-lg hover:bg-white/10"
                                    title="Import CSV"
                                >
                                    <Upload className="w-4 h-4" />
                                </button> */}
                                <button
                                    onClick={onExportCSV}
                                    className="p-2 glass rounded-lg hover:bg-white/10"
                                    title="Export CSV"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Issue Button */}
                {isHost && !showAddForm && (
                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setShowAddForm(true)}
                        className="mb-4"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Issue
                    </Button>
                )}

                {/* Add Issue Form */}
                {showAddForm && (
                    <div className="glass p-4 rounded-xl mb-4 space-y-3">
                        <Input
                            placeholder="Issue title"
                            value={newIssueTitle}
                            onChange={(e) => setNewIssueTitle(e.target.value)}
                            fullWidth
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={newIssueDescription}
                            onChange={(e) => setNewIssueDescription(e.target.value)}
                            className="input w-full min-h-[80px] resize-none"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddIssue} className="flex-1">
                                Add
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewIssueTitle('');
                                    setNewIssueDescription('');
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Issues List */}
                <div className="space-y-3">
                    {issues.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No issues yet. {isHost && 'Add your first issue!'}
                        </p>
                    ) : (
                        issues.map((issue) => (
                            <div
                                key={issue.id}
                                className={`glass p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all ${currentIssueId === issue.id ? 'border-2 border-primary-500' : ''
                                    } ${issue.isEstimated ? 'opacity-60' : ''}`}
                                onClick={() => !issue.isEstimated && onSelectIssue(issue.id)}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white truncate">
                                            {issue.title}
                                        </h4>
                                        {issue.description && (
                                            <p className="text-sm text-gray-400 line-clamp-2">
                                                {issue.description}
                                            </p>
                                        )}
                                    </div>

                                    {issue.isEstimated && (
                                        <div className="flex items-center gap-1 text-green-400">
                                            <Check className="w-4 h-4" />
                                            <span className="text-sm font-bold">{issue.estimate}</span>
                                        </div>
                                    )}

                                    {isHost && !issue.isEstimated && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteIssue(issue.id);
                                            }}
                                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500">
                    <p>Click an issue to start voting</p>
                    {isHost && <p className="mt-1">Import/Export via CSV for integration</p>}
                </div>
            </div>
        </>
    );
};
