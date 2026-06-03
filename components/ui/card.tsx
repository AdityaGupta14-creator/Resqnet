import { View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <View
      style={{
        backgroundColor: Colors.card,
        padding: Spacing.md,
        borderRadius: Radius.md,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}