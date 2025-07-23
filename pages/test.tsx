export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-600 mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Classes</h2>
            <p className="text-gray-600 mb-4">This card tests basic Tailwind classes.</p>
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-xl shadow-lg text-white">
            <h2 className="text-2xl font-semibold mb-4">Gradient Background</h2>
            <p className="mb-4">This card tests gradient backgrounds and custom brand colors.</p>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
              Gradient Button
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-brand-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Status Code Colors</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">Informational</div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg">Success</div>
            <div className="bg-teal-500 text-white px-4 py-2 rounded-lg">Redirection</div>
            <div className="bg-brand-500 text-white px-4 py-2 rounded-lg">Client Error</div>
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg">Server Error</div>
          </div>
        </div>
      </div>
    </div>
  );
} 