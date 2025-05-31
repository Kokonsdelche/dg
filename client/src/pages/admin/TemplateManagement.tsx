import React from 'react';
import TemplateManagement from '../../components/admin/TemplateManagement';

const TemplateManagementPage: React.FC = () => {
        return (
                <div className="min-h-screen bg-gray-50 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <TemplateManagement />
                        </div>
                </div>
        );
};

export default TemplateManagementPage; 