import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Toast } from '@components/toast';
import { getToken, removeRefreshToken, removeToken } from '@lib/JwtHelper';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  username: string;
  user_type: number;
  email_verified: number;
  user_type_name: string;
}

interface RootState {
  isLoggedIn: boolean;
  currentUser?: UserInfo | null;
  setCurrentUser?: (user: UserInfo) => void;
  setIsLoggedIn?: (isLoggedIn: boolean) => void;
  restoreSession: () => void;
  onLogout: (isShowToast?: boolean) => void;
}

export const useRootStore = create(
  devtools<RootState>((set, getState) => ({
    isLoggedIn: false,
    currentUser: null,
    setCurrentUser: (user: any) => set({ currentUser: user }),
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn: isLoggedIn }),

    restoreSession: () => {
      const token = getToken();
      if (token) {
        set({ isLoggedIn: true });
      } else {
        window.location.href = '/#/login';
        set({ isLoggedIn: false, currentUser: null });
      }
    },
    onLogout: (isShowToast?: boolean) => {
      set({ isLoggedIn: false, currentUser: null });
      removeToken();
      removeRefreshToken();
      isShowToast && Toast('success', 'Logout successfully!');
    }
  }))
);
