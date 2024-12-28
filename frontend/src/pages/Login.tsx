import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';

interface LoginFormState {
  username: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  isChangePassword?: boolean;
}

const useAuthState = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    isChangePassword: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  return {
    formState,
    setFormState,
    error,
    setError,
    isLoading,
    setIsLoading,
    isChangePassword,
    setIsChangePassword
  };
};

const validateForm = (form: LoginFormState): string => {
  if (!form.username || !form.password) {
    return 'Please fill in all fields';
  }
  if (form.isChangePassword && form.newPassword !== form.confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

export function Login() {
  const navigate = useNavigate();
  const auth = useAuthState();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm(auth.formState);
    if (validationError) {
      auth.setError(validationError);
      return;
    }

    auth.setIsLoading(true);
    try {
      const { username, password } = auth.formState;
      const signInOutput = await signIn({ 
        username, 
        password,
        options: { authFlowType: "USER_PASSWORD_AUTH" }
      });
      
      if (signInOutput.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        auth.setIsChangePassword(true);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      auth.setError(err.message || 'Invalid username or password');
    } finally {
      auth.setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50">
      <div className="w-full sm:w-[450px] mx-4">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center space-y-2 pt-8 pb-4">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </CardHeader>
          
          <CardBody className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input
                label="Username"
                value={auth.formState.username}
                onChange={(e) => auth.setFormState({...auth.formState, username: e.target.value})}
                isRequired
                size="lg"
                autoFocus
                classNames={{
                  base: "w-full",
                  mainWrapper: "w-full",
                  input: "w-full",
                  inputWrapper: "w-full"
                }}
              />
              <Input
                label="Password"
                type="password"
                value={auth.formState.password}
                onChange={(e) => auth.setFormState({...auth.formState, password: e.target.value})}
                isRequired
                size="lg"
                classNames={{
                  base: "w-full",
                  mainWrapper: "w-full",
                  input: "w-full",
                  inputWrapper: "w-full"
                }}
              />
              {auth.error && (
                <p className="text-danger text-sm text-center">{auth.error}</p>
              )}
              <Button
                type="submit"
                color="primary"
                isLoading={auth.isLoading}
                size="lg"
                className="w-full"
              >
                {auth.isChangePassword ? 'Change Password' : 'Sign In'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
