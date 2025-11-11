const Homepage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* Hero Section */}
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to ModuWeb
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Your complete business management solution
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Manage bookings, track visitors, handle sales, and grow your business with our comprehensive platform.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Get Started
          </a>
          <a 
            href="/about" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium text-lg"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
    
    {/* Features Section */}
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to run your business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Management</h3>
            <p className="text-gray-600">Effortlessly manage appointments and bookings with our intuitive system.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Track your business performance with detailed analytics and reports.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Setup</h3>
            <p className="text-gray-600">Get up and running quickly with our user-friendly configuration tools.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Homepage;