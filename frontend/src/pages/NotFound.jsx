import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white border border-[#DCE3DA] rounded-xl p-8 shadow-card">
        <div className="w-14 h-14 rounded-full bg-[#EBF2ED] text-[#244C3A] border border-[#CBD4C8] flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-4xl font-extrabold text-[#252B27] tracking-tight mb-2">404</h1>
        <p className="text-sm font-semibold text-[#252B27] mb-1">Page Not Found</p>
        <p className="text-xs text-[#737B75] mb-6 leading-relaxed">
          The requested route does not exist or has been relocated within the governance system.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')} size="md">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
