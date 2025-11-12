import CreateUserForm from '../components/CreateUserForm';

const CreateUserPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    {/* Background pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
    
    {/* Create user card */}
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Create Account</h1>
        <p className="text-slate-600">Join ModuWeb today</p>
      </div>
      
      <CreateUserForm />
    </div>
  </div>
);

export default CreateUserPage;
