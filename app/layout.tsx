import { View } from 'react-native';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </Providers>
  );
}
