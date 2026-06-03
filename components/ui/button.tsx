import { Pressable, Text } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'success';
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
}: Props) {
  const bg =
    variant === 'danger'
      ? Colors.danger
      : variant === 'success'
      ? Colors.success
      : Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: bg,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {title}
      </Text>
    </Pressable>
  );
}