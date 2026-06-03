import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
      }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
        RESQNET
      </Text>

      <Text style={{ color: 'gray', marginTop: 4 }}>
        Smart Emergency Response System
      </Text>

      {/* LOCATION CARD */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          📍 Current Location
        </Text>
        <Text style={{ marginTop: 5 }}>Lucknow, India</Text>
      </View>

      {/* STATUS CARD */}
      <View
        style={{
          marginTop: 15,
          padding: 15,
          backgroundColor: '#e8fff0',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          🟢 System Status
        </Text>
        <Text style={{ marginTop: 5 }}>All systems active</Text>
      </View>

      {/* BUTTONS */}
      <Pressable
        onPress={() => router.push('/hospital')}
        style={{
          marginTop: 25,
          backgroundColor: '#2563eb',
          padding: 15,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Find Nearest Hospital
        </Text>
      </Pressable>

      {/* SOS BUTTON */}
      <Pressable
        onPress={() => router.push('/detection')}
        style={{
          marginTop: 15,
          backgroundColor: '#ef4444',
          padding: 18,
          borderRadius: 50,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          EMERGENCY SOS
        </Text>
      </Pressable>
    </View>
  );
}