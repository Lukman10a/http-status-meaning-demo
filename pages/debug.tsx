export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind Debug</h1>
      
      <div className="space-y-4">
        <div className="bg-red-500 text-white p-4 rounded">
          Red background - if you see this, Tailwind is working!
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded">
          Green background - basic colors work
        </div>
        
        <div className="bg-brand-500 text-white p-4 rounded">
          Brand color - custom colors work
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded">
          Gradient background - gradients work
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Hover me!
        </button>
      </div>
    </div>
  );
} 