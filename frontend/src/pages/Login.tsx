import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface LoginFormData {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/home');
    } catch {} // Error is handled by store
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Input
                label="Username"
                {...register('username', { required: 'Username is required' })}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                autoFocus
                size="lg"
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                size="lg"
                classNames={{
                  base: "w-full",
                  mainWrapper: "w-full",
                  input: "w-full",
                  inputWrapper: "w-full"
                }}
              />
              {error && (
                <p className="text-danger text-sm text-center">{error}</p>
              )}
              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>
            </form>          </CardBody>
        </Card>
      </div>
    </div>
  );
}
