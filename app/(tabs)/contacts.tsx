import { View, Text, Pressable, FlatList, ScrollView } from 'react-native';

export default function ContactsScreen() {
  const contacts = [
    { id: '1', name: 'Mom', relation: 'Family' },
    { id: '2', name: 'Dad', relation: 'Family' },
    { id: '3', name: 'Brother', relation: 'Family' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
        Emergency Contacts
      </Text>

      <Text style={{ color: 'gray', marginTop: 5 }}>
        People who will be notified during emergency
      </Text>

      {/* LIST */}
      <View style={{ marginTop: 20 }}>
        {contacts.map((item) => (
          <View
            key={item.id}
            style={{
              padding: 15,
              borderRadius: 12,
              backgroundColor: '#f1f5f9',
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {item.name}
              </Text>
              <Text style={{ color: 'gray', marginTop: 2 }}>
                {item.relation}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#22c55e',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>
                ACTIVE
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* BUTTON (NOW VISIBLE) */}
      <Pressable
        style={{
          marginTop: 20,
          backgroundColor: '#ef4444',
          padding: 15,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Notify All Contacts
        </Text>
      </Pressable>

      {/* EXTRA SPACE */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}