// FeatureCard component - ultra minimal design
const FeatureCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <div className="card-hover p-6 text-left">
      <h3 className="font-medium text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
};

const Homepage = () => (
  <div className="content-wrapper text-center">
    <div className="fade-in">
      <h1 className="text-4xl font-bold text-text-primary">Welcome to ModuWeb</h1>
      <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg">
        Your modular business management solution — containerized customers, independent databases, YAML-driven configuration.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href="/dashboard" 
          className="btn-primary px-6 py-3 text-base"
        >
          Get Started
        </a>
        <a 
          href="/about" 
          className="btn-secondary px-6 py-3 text-base"
        >
          Learn More
        </a>
      </div>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">
      <FeatureCard 
        title="Booking Management" 
        desc="Manage appointments and resources with ease" 
      />
      <FeatureCard 
        title="Analytics Dashboard" 
        desc="Track performance with comprehensive metrics" 
      />
      <FeatureCard 
        title="Easy Setup" 
        desc="Containerized deployments for every customer" 
      />
    </div>
  </div>
);

export default Homepage;