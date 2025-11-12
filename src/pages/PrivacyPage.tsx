const PrivacyPage = () => (
  <div className="content-wrapper">
    <div className="fade-in">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Privacy Policy</h2>
      
      <div className="card p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Our Commitment to Privacy</h3>
          <p className="text-slate-600 leading-relaxed">
            Your privacy is important to us. This privacy policy explains how ModuWeb collects, 
            uses, and protects your personal information when you use our services.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Information We Collect</h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            We collect information that you provide directly to us, such as:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
            <li>Account information (username, email, password)</li>
            <li>Profile information and preferences</li>
            <li>Booking and reservation data</li>
            <li>Communications with our support team</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">How We Use Your Information</h3>
          <p className="text-slate-600 leading-relaxed mb-3">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
            <li>Provide and maintain our services</li>
            <li>Process bookings and manage reservations</li>
            <li>Send important updates and notifications</li>
            <li>Improve our platform and user experience</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Data Security</h3>
          <p className="text-slate-600 leading-relaxed">
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Us</h3>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about this privacy policy or our practices, 
            please contact us at privacy@moduweb.com
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPage;