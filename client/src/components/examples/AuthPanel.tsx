import { useState } from 'react';
import AuthPanel from '../AuthPanel';
import { Button } from '@/components/ui/button';

export default function AuthPanelExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Auth Panel</Button>
      <AuthPanel 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEmailCollected={(email) => console.log('Email collected:', email)}
      />
    </div>
  );
}