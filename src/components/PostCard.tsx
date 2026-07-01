import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Dimensions,
  Alert, ActivityIndicator
} from 'react-native';
<<<<<<< HEAD
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useStore } from '../store/useStore';
import TextOverlay from './TextOverlay';

const { width } = Dimensions.get('window');
// Item 4: photos are always 1:1 square.
const MEDIA_SIZE = width;
=======
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

interface Post {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string;
  mediaURL: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
<<<<<<< HEAD
  textOverlay?: string;
  textColor?: string;
  textOverlayX?: number;
  textOverlayY?: number;
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const PostCard = React.memo(function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useStore();
<<<<<<< HEAD
  const navigation = useNavigation<any>();
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

  const handleLike = async () => {
    setLoading(true);
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likesCount: increment(post.isLiked ? -1 : 1),
      });
      onLike?.(post.id);
<<<<<<< HEAD
=======
      // create notification when liking someone else's post
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      if (!post.isLiked) {
        try {
          const ownerId = post.userId;
          if (ownerId && ownerId !== currentUser?.uid) {
            await addDoc(collection(db, 'notifications'), {
              toUserId: ownerId,
              fromUserId: currentUser?.uid,
              type: 'like',
              postId: post.id,
              message: `${currentUser?.displayName || 'Seseorang'} menyukai postingan Anda`,
              createdAt: serverTimestamp(),
              isRead: false,
            });
          }
        } catch (e) {
          console.log('Failed to create notification:', e);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal update like');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Item 1: tap avatar or username to open that user's profile.
  const goToProfile = () => navigation.navigate('Profile', { userId: post.userId });

  const overlayData = post.textOverlay
    ? { text: post.textOverlay, color: post.textColor || '#ffffff', xPct: post.textOverlayX ?? 50, yPct: post.textOverlayY ?? 80 }
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={goToProfile}>
=======
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
          {post.userPhotoURL ? (
            <Image source={{ uri: post.userPhotoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.userDisplayName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <Text style={styles.username}>{post.userDisplayName}</Text>
<<<<<<< HEAD
        </TouchableOpacity>
        <Text style={styles.moreBtn}>⋮</Text>
      </View>

      {post.mediaURL && (
        <View style={{ width: MEDIA_SIZE, height: MEDIA_SIZE }}>
          <Image
            source={{ uri: post.mediaURL }}
            style={styles.image}
            resizeMode="cover"
            fadeDuration={0}
          />
          {overlayData && (
            <TextOverlay data={overlayData} containerWidth={MEDIA_SIZE} containerHeight={MEDIA_SIZE} />
          )}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} disabled={loading}>
=======
        </View>
        <Text style={styles.moreBtn}>⋮</Text>
      </View>

      {/* Image */}
      {post.mediaURL && (
        <Image
          source={{ uri: post.mediaURL }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={0}
        />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleLike}
          disabled={loading}
        >
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
          {loading ? (
            <ActivityIndicator size="small" color="#E91E63" />
          ) : (
            <Text style={styles.actionIcon}>{post.isLiked ? '❤️' : '🤍'}</Text>
          )}
        </TouchableOpacity>
<<<<<<< HEAD
        <TouchableOpacity style={styles.actionBtn} onPress={() => onComment?.(post.id)}>
=======
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onComment?.(post.id)}
        >
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
          <Text style={styles.actionIcon}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
=======
      {/* Stats */}
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      <View style={styles.stats}>
        <Text style={styles.statText}>{post.likesCount || 0} likes</Text>
        <Text style={styles.statText}>{post.commentsCount} comments</Text>
      </View>

<<<<<<< HEAD
=======
      {/* Caption */}
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      <View style={styles.caption}>
        <Text style={styles.captionUser}>{post.userDisplayName}</Text>
        <Text style={styles.captionText}>{post.caption}</Text>
      </View>
    </View>
  );
});

export default PostCard;

const styles = StyleSheet.create({
<<<<<<< HEAD
  card: { width, backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#222' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  username: { color: '#fff', fontSize: 14, fontWeight: '600' },
  moreBtn: { fontSize: 20, color: '#888' },
  image: { width: '100%', height: '100%' },
  actions: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 8 },
  actionBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 20 },
  stats: { paddingHorizontal: 12, marginBottom: 8 },
  statText: { color: '#888', fontSize: 12 },
  caption: { paddingHorizontal: 12, paddingBottom: 12 },
  captionUser: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  captionText: { color: '#ccc', fontSize: 14, lineHeight: 20 },
});
=======
  card: {
    width: width,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  moreBtn: {
    fontSize: 20,
    color: '#888',
  },
  image: {
    width: '100%',
    height: width,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  stats: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  statText: {
    color: '#888',
    fontSize: 12,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  captionUser: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  captionText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
