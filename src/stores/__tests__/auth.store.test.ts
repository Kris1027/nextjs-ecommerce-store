import {
  useAuthStore,
  getAccessToken,
  getRefreshToken,
} from '@/stores/auth.store';
import {
  setRefreshTokenCookie,
  getRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '@/lib/auth-tokens';
import type { UserProfileDto } from '@/api/generated/types.gen';

vi.mock('@/lib/auth-tokens', () => ({
  setRefreshTokenCookie: vi.fn(),
  getRefreshTokenCookie: vi.fn(),
  clearRefreshTokenCookie: vi.fn(),
}));

const mockUser: UserProfileDto = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'John' as unknown as UserProfileDto['firstName'],
  lastName: 'Doe' as unknown as UserProfileDto['lastName'],
  role: 'CUSTOMER',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,
    });
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isHydrated).toBe(false);
  });

  describe('setAuth', () => {
    it('should set accessToken, refreshToken, and user', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);
      const state = useAuthStore.getState();

      expect(state.accessToken).toBe('access-1');
      expect(state.refreshToken).toBe('refresh-1');
      expect(state.user).toEqual(mockUser);
    });

    it('should call setRefreshTokenCookie with the refresh token', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);
      expect(setRefreshTokenCookie).toHaveBeenCalledWith('refresh-1');
    });
  });

  describe('setTokens', () => {
    it('should update tokens without changing user', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);
      useAuthStore.getState().setTokens('access-2', 'refresh-2');

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('access-2');
      expect(state.refreshToken).toBe('refresh-2');
      expect(state.user).toEqual(mockUser);
    });

    it('should call setRefreshTokenCookie', () => {
      useAuthStore.getState().setTokens('access-2', 'refresh-2');
      expect(setRefreshTokenCookie).toHaveBeenCalledWith('refresh-2');
    });
  });

  describe('setUser', () => {
    it('should update user without changing tokens', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);

      const updatedUser = {
        ...mockUser,
        firstName: 'Jane' as unknown as UserProfileDto['firstName'],
      };
      useAuthStore.getState().setUser(updatedUser);

      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('Jane');
      expect(state.accessToken).toBe('access-1');
    });
  });

  describe('clearAuth', () => {
    it('should reset all auth state to null', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.user).toBeNull();
    });

    it('should call clearRefreshTokenCookie', () => {
      useAuthStore.getState().clearAuth();
      expect(clearRefreshTokenCookie).toHaveBeenCalled();
    });
  });

  describe('hydrateAuth', () => {
    it('should set refreshToken from cookie when cookie exists', () => {
      vi.mocked(getRefreshTokenCookie).mockReturnValue('cookie-token');
      useAuthStore.getState().hydrateAuth();

      expect(useAuthStore.getState().refreshToken).toBe('cookie-token');
    });

    it('should not change state when no cookie exists', () => {
      vi.mocked(getRefreshTokenCookie).mockReturnValue(null);
      useAuthStore.getState().hydrateAuth();

      expect(useAuthStore.getState().refreshToken).toBeNull();
    });
  });

  describe('setHydrated', () => {
    it('should mark store as hydrated', () => {
      useAuthStore.getState().setHydrated();
      expect(useAuthStore.getState().isHydrated).toBe(true);
    });
  });

  describe('getAccessToken / getRefreshToken', () => {
    it('should return current tokens from store state', () => {
      useAuthStore.getState().setAuth('access-1', 'refresh-1', mockUser);

      expect(getAccessToken()).toBe('access-1');
      expect(getRefreshToken()).toBe('refresh-1');
    });
  });
});
