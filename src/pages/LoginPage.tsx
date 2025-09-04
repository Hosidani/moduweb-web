
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login Page</h2>
        <p className="mb-6">Please log in to continue.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Log In
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4"
          onClick={() => navigate('/create-user')}
        >
          Create User
        </button>
      </div>
    </div>
  );
};

export default LoginPage;