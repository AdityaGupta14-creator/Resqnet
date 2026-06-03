import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
        Profile
      </Text>

      <Text style={{ color: 'gray', marginTop: 5 }}>
        Emergency user information
      </Text>

      {/* PROFILE CARD */}
      <View
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 15,
          backgroundColor: '#f1f5f9',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>
          Rahul Sharma
        </Text>

        <Text style={{ marginTop: 5, color: 'gray' }}>
          Blood Group: O+
        </Text>

        <Text style={{ marginTop: 5, color: 'gray' }}>
          Age: 21
        </Text>
      </View>

      {/* STATUS CARD */}
      <View
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 15,
          backgroundColor: '#e8fff0',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          🟢 Safety Status
        </Text>

        <Text style={{ marginTop: 5 }}>
          User is currently safe
        </Text>
      </View>

      {/* SETTINGS CARD */}
      <View
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 15,
          backgroundColor: '#eff6ff',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          Emergency Settings
        </Text>

        <Text style={{ marginTop: 8 }}>Auto SOS: Enabled</Text>
        <Text>Location Sharing: Active</Text>
      </View>
    </View>
  );
}