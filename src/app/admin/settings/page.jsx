export default function AdminSettings() {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h1>
  
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
  
          <div className="flex items-center justify-between border-b py-4">
            <span className="text-gray-700">Dark Mode</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
  
          <div className="flex items-center justify-between border-b py-4">
            <span className="text-gray-700">Enable Two-Factor Authentication</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
  
          <div className="flex items-center justify-between border-b py-4">
            <span className="text-gray-700">Receive Email Notifications</span>
            <input type="checkbox" className="w-5 h-5" />
          </div>
  
          <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    );
  }
  