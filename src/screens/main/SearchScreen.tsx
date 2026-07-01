import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  FlatList, TouchableOpacity, ActivityIndicator, Image
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../utils/firebase';


export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('displayName', '>=', text),
        where('displayName', '<=', text + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari</Text>
      </View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari user..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      {loading && <ActivityIndicator color="#E91E63" style={{ marginTop: 20 }} />}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Item 1: tapping a search result opens that user's profile
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
          >
            <View style={styles.avatar}>
              {item.photoURL ? (
                <Image source={{ uri: item.photoURL }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>
                  {(item.displayName || item.username)?.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View>
              {/* Privasi: email TIDAK ditampilkan di sini. Email cuma untuk
                  autentikasi / halaman akun pribadi (ProfileScreen milik sendiri),
                  bukan untuk ditampilkan ke user lain. */}
              <Text style={styles.displayName}>
                {item.displayName || item.username || 'User'}
              </Text>
              {item.username ? (
                <Text style={styles.username}>@{item.username}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchText.length > 0 && !loading ? (
            <Text style={styles.emptyText}>User tidak ditemukan</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  searchBox: { padding: 12 },
  searchInput: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  displayName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  username: { color: '#888', fontSize: 13 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
});
