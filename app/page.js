import Image from "next/image";
import SetGoal from './_components/SetGoal';
import PuffTracker from './_components/PuffTracker';
import DailyStats from './_components/DailyStats';
import GoalProgress from './_components/GoalProgress';
import StatsDashboard from './_components/StatsDashboard';

export default function Home() {
  return (
     <div>
      <SetGoal />
      
      {/* <!-- Header --> */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">QV</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quit Vipe</h1>
            <p className="text-sm text-slate-500">Track your progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-slate-500">Active</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Puff Tracker */}
        <PuffTracker />
        
        {/* Goal Progress */}
        <GoalProgress />
        
        {/* Daily Statistics */}
        <DailyStats />
        
        
        {/* Stats Dashboard */}
        <StatsDashboard />
      </main>
    </div>
  )
}
