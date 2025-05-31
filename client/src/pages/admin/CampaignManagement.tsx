import React from 'react';
import CampaignManagement from '../../components/admin/CampaignManagement';

const CampaignManagementPage: React.FC = () => {
        return (
                <div className="min-h-screen bg-gray-50 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <CampaignManagement />
                        </div>
                </div>
        );
};

export default CampaignManagementPage; 