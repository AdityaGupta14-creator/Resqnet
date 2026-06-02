import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function Processing() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/hospital');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ef4444',
          textAlign: 'center',
        }}
      >
        🚨 EMERGENCY ACTIVATED
      </Text>

      <Text
        style={{
          textAlign: 'center',
          marginTop: 8,
          color: '#666',
        }}
      >
        Emergency response system is now handling your case
      </Text>

      {/* STATUS CARD */}
      <View
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          📍 Locating nearest hospital...
        </Text>

        <Text style={{ marginTop: 10 }}>
          🚑 Searching for available ambulance...
        </Text>

        <Text style={{ marginTop: 10 }}>
          📡 Notifying emergency contacts...
        </Text>
      </View>

      {/* LOADING STATE TEXT */}
      <View
        style={{
          marginTop: 30,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#ef4444',
          }}
        >
          Please stay calm
        </Text>

        <Text style={{ marginTop: 5, color: '#666' }}>
          Connecting to emergency services...
        </Text>
      </View>
    </View>
  );
}