import AdminDashboard from '../AdminDashboard';

export default function AdminDashboardExample() {
  return (
    <AdminDashboard 
      isAuthenticated={false}
      onLogin={(password) => console.log('Login attempt with:', password)}
    />
  );
}