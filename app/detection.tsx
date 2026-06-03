import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Detection() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/processing');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* WARNING CARD */}
      <View
        style={{
          backgroundColor: '#fff1f2',
          padding: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#fecdd3',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444' }}>
          ⚠ POSSIBLE ACCIDENT DETECTED
        </Text>

        <Text style={{ marginTop: 10, color: '#444' }}>
          We detected unusual motion patterns from your device.
        </Text>
      </View>

      {/* QUESTION */}
      <Text
        style={{
          marginTop: 30,
          fontSize: 22,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        Are you safe?
      </Text>

      {/* TIMER CARD */}
      <View
        style={{
          marginTop: 15,
          padding: 15,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16 }}>
          Respond within
        </Text>

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ef4444' }}>
          {timeLeft}s
        </Text>
      </View>

      {/* BUTTONS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 30,
        }}
      >
        <Pressable
          onPress={() => router.push('/')}
          style={{
            flex: 1,
            backgroundColor: '#22c55e',
            padding: 15,
            borderRadius: 12,
            marginRight: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            I'M SAFE
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/processing')}
          style={{
            flex: 1,
            backgroundColor: '#ef4444',
            padding: 15,
            borderRadius: 12,
            marginLeft: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            NEED HELP
          </Text>
        </Pressable>
      </View>
    </View>
  );
}