import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, confirmSignIn } from 'aws-amplify/auth';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const signInOutput = await signIn({ 
        username, 
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH"
        }
      });
      
      if (signInOutput.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setIsChangePassword(true);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await confirmSignIn({
        challengeResponse: newPassword
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-violet-100">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-lg">
          <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-0">
            <h1 className="text-2xl font-bold">
              {isChangePassword ? 'Change Password' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-default-500">
              {isChangePassword ? 'Please set a new password' : 'Please sign in to continue'}
            </p>
          </CardHeader>
          <CardBody className="gap-4 py-8">
            {!isChangePassword ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Username"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
                <Input
                  label="Password"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && (
                  <p className="text-danger text-center text-sm">{error}</p>
                )}
                <Button 
                  type="submit" 
                  color="primary" 
                  size="lg"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <Input
                  label="New Password"
                  type="password"
                  variant="bordered"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  variant="bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error && (
                  <p className="text-danger text-center text-sm">{error}</p>
                )}
                <Button 
                  type="submit"
                  color="primary" 
                  size="lg"
                  isLoading={isLoading}
                >
                  Change Password
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
