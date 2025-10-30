import { useState } from 'react';
import { Monitor, Users, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ComputerDetail from './components/ComputerDetail';
import AllStudents from './components/AllStudents';

type View = 'dashboard' | 'computer-detail' | 'all-students';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedComputer, setSelectedComputer] = useState<{ id: string; name: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectComputer = (id: string, name: string) => {
    setSelectedComputer({ id, name });
    setCurrentView('computer-detail');
    setMobileMenuOpen(false);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedComputer(null);
  };

  const navigateToAllStudents = () => {
    setCurrentView('all-students');
    setMobileMenuOpen(false);
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedComputer(null);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Monitor className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Allocator</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Manage computer assignments</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={navigateToDashboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Monitor size={18} />
                Dashboard
              </button>
              <button
                onClick={navigateToAllStudents}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'all-students'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={18} />
                All Students
              </button>
            </div>

            <button
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <button
                onClick={navigateToDashboard}
                className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Monitor size={18} />
                Dashboard
              </button>
              <button
                onClick={navigateToAllStudents}
                className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg transition-colors mt-2 ${
                  currentView === 'all-students'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={18} />
                All Students
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard onSelectComputer={handleSelectComputer} />
        )}
        {currentView === 'computer-detail' && selectedComputer && (
          <ComputerDetail
            computerId={selectedComputer.id}
            computerName={selectedComputer.name}
            onBack={handleBack}
          />
        )}
        {currentView === 'all-students' && (
          <AllStudents onBack={navigateToDashboard} />
        )}
      </main>
    </div>
  );
}

export default App;
