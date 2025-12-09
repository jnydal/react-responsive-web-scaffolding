import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useLoginMutation } from '../../../services/api/auth-api';
import { useAppDispatch } from '../../../app/hooks';
import { setUser } from '../redux/auth-slice';
import { loginSchema, type LoginFormData } from '../types/login-schema';
import type { LoginResponse } from '../types/auth.types';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
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
    reValidateMode: 'onSubmit',
  });

  // Focus identifier field on mount
  useEffect(() => {
    setFocus('identifier');
  }, [setFocus]);

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
        identifier: data.identifier,
        password: data.password,
      }).unwrap();

      // Update auth state
      const typedResult = result as LoginResponse;
      const user = typedResult.user ?? { id: 'unknown', username: data.identifier };
      dispatch(setUser(user));

      // Redirect to returnTo or default route
      const returnTo = searchParams.get('returnTo') || '/';
      navigate(returnTo, { replace: true });
    } catch (error) {
      const status =
        error && typeof error === 'object' && 'status' in error
          ? (error as { status?: number }).status ?? 0
          : 0;

      const message =
        status === 401
          ? 'E-post/brukernavn eller passord er feil. Vennligst prøv igjen.'
          : 'Noe gikk galt ved innlogging. Vennligst prøv igjen senere.';

      setError('root', {
        type: 'server',
        message,
      });
      errorAlertRef.current?.focus();
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-md rounded-lg border border-slate-100/70 bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Logg inn</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {errors.root && (
              <Alert
                ref={errorAlertRef}
                color="failure"
                tabIndex={-1}
                aria-live="assertive"
                role="alert"
                className="text-sm"
              >
                {errors.root.message}
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                E-post eller brukernavn
              </Label>
              <TextInput
                id="identifier"
                type="text"
                autoComplete="username"
                {...register('identifier')}
                color={errors.identifier ? 'failure' : 'gray'}
                aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                aria-invalid={!!errors.identifier}
                required
              />
              {errors.identifier && (
                <p id="identifier-error" className="text-sm text-red-600">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Passord
              </Label>
              <TextInput
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                color={errors.password ? 'failure' : 'gray'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={!!errors.password}
                required
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  Logger inn...
                </span>
              ) : (
                'Logg inn'
              )}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm text-gray-700">
            <div>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Glemt passord?
              </Link>
            </div>
            <div>
              <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                Ny bruker? Opprett gratis profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

