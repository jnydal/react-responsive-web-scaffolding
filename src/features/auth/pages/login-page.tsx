import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Label, TextInput } from 'flowbite-react';
import { useLoginMutation } from '../../../services/api/auth-api';
import { useAppDispatch } from '../../../app/hooks';
import { setUser } from '../redux/auth-slice';
import { loginSchema, type LoginFormData } from '../types/login-schema';
import { ApiError } from '../../../services/api-client';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  // Focus identifier field on mount
  useEffect(() => {
    identifierInputRef.current?.focus();
  }, []);

  // Focus first error field on validation error
  useEffect(() => {
    if (errors.identifier) {
      setFocus('identifier');
    } else if (errors.password) {
      setFocus('password');
    }
  }, [errors, setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        username: data.identifier,
        password: data.password,
      }).unwrap();

      // Update auth state
      if (result && typeof result === 'object' && 'user' in result) {
        dispatch(setUser(result.user as { id?: string; [key: string]: unknown }));
      } else {
        // If no user in response, create a minimal user object
        dispatch(setUser({ id: 'unknown' }));
      }

      // Redirect to returnTo or default route
      const returnTo = searchParams.get('returnTo') || '/';
      navigate(returnTo, { replace: true });
    } catch (error) {
      // RTK Query unwrap() throws errors in a specific format
      const apiError = error as { status?: number; data?: unknown } | ApiError;
      const status = 'status' in apiError ? apiError.status : 0;

      if (status === 401) {
        // Incorrect credentials
        setError('root', {
          type: 'server',
          message: 'E-post/brukernavn eller passord er feil. Vennligst prøv igjen.',
        });
        errorAlertRef.current?.focus();
      } else {
        // Server or network error
        setError('root', {
          type: 'server',
          message: 'Noe gikk galt ved innlogging. Vennligst prøv igjen senere.',
        });
        errorAlertRef.current?.focus();
      }
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Logg inn</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* General error message */}
        {errors.root && (
          <div
            ref={errorAlertRef}
            role="alert"
            className="mb-4 p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200"
            tabIndex={-1}
          >
            {errors.root.message}
          </div>
        )}

        {/* Identifier field */}
        <div className="mb-4">
          <Label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
            E-post eller brukernavn
          </Label>
          <TextInput
            id="identifier"
            type="text"
            {...register('identifier')}
            color={errors.identifier ? 'failure' : 'gray'}
            helperText={errors.identifier?.message}
            aria-describedby={errors.identifier ? 'identifier-error' : undefined}
            aria-invalid={!!errors.identifier}
          />
          {errors.identifier && (
            <p id="identifier-error" className="mt-1 text-sm text-red-600">
              {errors.identifier.message}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-6">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Passord
          </Label>
          <TextInput
            id="password"
            type="password"
            {...register('password')}
            color={errors.password ? 'failure' : 'gray'}
            helperText={errors.password?.message}
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mb-4"
          isProcessing={isLoading}
        >
          {isLoading ? 'Logger inn...' : 'Logg inn'}
        </Button>
      </form>

      {/* Links */}
      <div className="mt-6 space-y-2 text-center text-sm">
        <div>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Glemt passord?
          </Link>
        </div>
        <div>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Ny bruker? Opprett gratis profil
          </Link>
        </div>
      </div>
    </div>
  );
}

