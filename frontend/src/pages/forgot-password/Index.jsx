import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/forgot-password', { replace: true }); }, [navigate]);
  return null;
}
