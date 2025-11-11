const AboutPage = () => (
  <div className="content-wrapper">
    <div className="fade-in">
      <h2 className="text-2xl font-semibold text-text-primary">About ModuWeb</h2>
      <p className="mt-3 text-text-secondary">
        A modular web platform that lets customers run isolated instances with their own databases and configuration files. 
        Designed for agencies and SaaS integrators by Hosidani - we are two developers passionate about creating products from start to finish.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-text-primary mb-3">🎯 Our Mission</h3>
          <p className="text-text-secondary text-sm">
            To provide a scalable, modular platform that enables businesses to deploy isolated customer instances with ease.
          </p>
        </div>
        
        <div className="card p-6">
          <h3 className="font-semibold text-text-primary mb-3">🚀 Technology</h3>
          <p className="text-text-secondary text-sm">
            Built with modern technologies including containerization, YAML configuration, and microservices architecture.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;