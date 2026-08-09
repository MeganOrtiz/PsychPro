import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { TokenCache } from '@clerk/clerk-expo';

// SecureStore is unavailable on web; Clerk manages its own storage there.
export const tokenCache: TokenCache | undefined =
  Platform.OS === 'web'
    ? undefined
    : {
        async getToken(key: string) {
          try {
            return await SecureStore.getItemAsync(key);
          } catch {
            return null;
          }
        },
        async saveToken(key: string, value: string) {
          try {
            await SecureStore.setItemAsync(key, value);
          } catch {
            // ignore
          }
        },
        async clearToken(key: string) {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch {
            // ignore
          }
        },
      };
