import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Hospital() {
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
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
        🏥 Assigned Hospital
      </Text>

      <Text style={{ color: 'gray', marginTop: 4 }}>
        Emergency response team has selected the nearest hospital
      </Text>

      {/* HOSPITAL CARD */}
      <View
        style={{
          marginTop: 25,
          padding: 20,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>
          Apollo Hospital
        </Text>

        <Text style={{ marginTop: 10 }}>
          📍 Distance: 2.4 km
        </Text>

        <Text style={{ marginTop: 8 }}>
          ⏱ Estimated Arrival: 7 mins
        </Text>

        <Text style={{ marginTop: 8 }}>
          🛏 ICU Beds: 4 Available
        </Text>
      </View>

      {/* STATUS CARD */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#e8fff0',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: '600' }}>
          🟢 Hospital Ready
        </Text>

        <Text style={{ marginTop: 5 }}>
          Emergency team notified and prepared
        </Text>
      </View>

      {/* BUTTON */}
      <Pressable
        onPress={() => router.push('/(tabs)/map')}
        style={{
          marginTop: 30,
          backgroundColor: '#2563eb',
          padding: 15,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Open Live Map
        </Text>
      </Pressable>
    </View>
  );
}