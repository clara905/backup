import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Dimensions,
  ActivityIndicator
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useStore } from '../store/useStore';
import TextOverlay from './TextOverlay';

const { width, height } = Dimensions.get('window');

interface Video {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string;
  mediaURL: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  textOverlay?: string;
  textColor?: string;
  textOverlayX?: number;
  textOverlayY?: number;
}

interface VidioCardProps {
  video: Video;
  isActive: boolean; // whether this card is the one currently on screen
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
}

export default function VidioCard({ video, isActive, onLike, onComment }: VidioCardProps) {
  const [liked, setLiked] = useState(video.isLiked);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const { currentUser } = useStore();
  const navigation = useNavigation<any>();
  const isScreenFocused = useIsFocused(); // item 5: pause when the tab/screen isn't focused

  const shouldPlay = isActive && isScreenFocused;

  const player = useVideoPlayer(video.mediaURL || '', (p) => {
    p.loop = true;
    p.muted = muted;
    if (!shouldPlay) p.pause();
  });

  React.useEffect(() => {
    try {
      player.muted = muted;
      if (shouldPlay) player.play();
      else player.pause();
    } catch (e) {}
  }, [shouldPlay, muted, player]);

  const handleLike = async () => {
    setLoading(true);
    try {
      const videoRef = doc(db, 'posts', video.id);
      await updateDoc(videoRef, { likesCount: increment(liked ? -1 : 1) });
      setLiked(!liked);
      setLikesCount(likesCount + (liked ? -1 : 1));
      onLike?.(video.id);
      if (!liked) {
        try {
          const ownerId = video.userId;
          if (ownerId && ownerId !== currentUser?.uid) {
            await addDoc(collection(db, 'notifications'), {
              toUserId: ownerId,
              fromUserId: currentUser?.uid,
              type: 'like',
              postId: video.id,
              message: `${currentUser?.displayName || 'Seseorang'} menyukai postingan Anda`,
              createdAt: serverTimestamp(),
              isRead: false,
            });
          }
        } catch (e) {
          console.log('Error creating notification:', e);
        }
      }
    } catch (error) {
      console.log('Error updating like:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => navigation.navigate('Profile', { userId: video.userId });

  const overlayData = video.textOverlay
    ? { text: video.textOverlay, color: video.textColor || '#ffffff', xPct: video.textOverlayX ?? 50, yPct: video.textOverlayY ?? 80 }
    : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoWrapper}
        onPress={() => setMuted((m) => !m)}
      >
        {video.mediaURL ? (
          <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📹</Text>
          </View>
        )}

        {overlayData && (
          <TextOverlay data={overlayData} containerWidth={width} containerHeight={height * 0.85} />
        )}

        <View style={styles.muteBadge}>
          <Text style={styles.muteIcon}>{muted ? '🔇' : '🔊'}</Text>
        </View>

        <View style={styles.sideActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#E91E63" />
            ) : (
              <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => onComment?.(video.id)}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomInfo}>
          <TouchableOpacity style={styles.userSection} onPress={goToProfile}>
            {video.userPhotoURL ? (
              <Image source={{ uri: video.userPhotoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {video.userDisplayName?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.username}>{video.userDisplayName}</Text>
              <Text style={styles.caption} numberOfLines={1}>{video.caption}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.stats}>
            <Text style={styles.statText}>{likesCount}</Text>
            <Text style={styles.statText}>{video.commentsCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: height * 0.85, backgroundColor: '#000' },
  videoWrapper: { flex: 1, position: 'relative' },
  video: { flex: 1, width: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  placeholderText: { fontSize: 48 },
  muteBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, padding: 8 },
  muteIcon: { fontSize: 16 },
  sideActions: { position: 'absolute', right: 12, bottom: 120, alignItems: 'center', gap: 16 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 24 },
  bottomInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userSection: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  username: { color: '#fff', fontSize: 14, fontWeight: '600' },
  caption: { color: '#ccc', fontSize: 12, marginTop: 2 },
  stats: { alignItems: 'center', marginLeft: 12 },
  statText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
