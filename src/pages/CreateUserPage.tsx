import CreateUserForm from '../components/CreateUserForm';

const CreateUserPage = () => (
  <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="bg-white rounded shadow p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      <CreateUserForm />
    </div>
  </div>
);

export default CreateUserPage;
