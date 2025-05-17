
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import BrainDump from '@/components/dashboard/BrainDump';
import EnhancedCalendar from '@/components/dashboard/EnhancedCalendar';
import TaskBoard from '@/components/dashboard/TaskBoard';
import StudyMaterials from '@/components/dashboard/StudyMaterials';
import ProgressCard from '@/components/dashboard/ProgressCard';
import { useAuth } from '@/context/auth';

const Index = () => {
  const { userId } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 pb-16 md:pb-6 overflow-auto animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome to StudyFlow</h1>
            <p className="text-muted-foreground mb-6">Organize your study sessions and manage your academic workflow</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <BrainDump />
              </div>
              <div>
                <ProgressCard />
              </div>
              <div className="lg:col-span-2">
                <TaskBoard />
              </div>
              <div>
                <EnhancedCalendar />
              </div>
              <div className="lg:col-span-3">
                <StudyMaterials />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Index;
