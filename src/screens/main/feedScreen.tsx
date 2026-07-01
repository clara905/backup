import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, Image,
<<<<<<< HEAD
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Dimensions
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  collection, query, orderBy, limit, getDocs, where,
  doc, updateDoc, increment, addDoc, serverTimestamp, onSnapshot,
   arrayUnion, arrayRemove 
=======
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  collection, query, orderBy, limit, getDocs,
  doc, updateDoc, increment, addDoc, serverTimestamp
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utils/firebase';
import { useStore } from '../../store/useStore';
import AudioPlayer from '../../components/AudioPlayer';
<<<<<<< HEAD
import TextOverlay from '../../components/TextOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Item 4: fixed standard sizes so every photo is 1:1 and every video is 9:16.
const IMAGE_SIZE = { width: SCREEN_WIDTH, height: SCREEN_WIDTH };
const VIDEO_SIZE = { width: SCREEN_WIDTH, height: SCREEN_WIDTH * (16 / 9) };

/**
 * Item 3 (stability) + item 5 (audio keeps playing after navigating away) + item 6
 * (no YouTube-style play/pause button — autoplay + loop like Reels/TikTok, tap only mutes).
 *
 * IMPORTANT: this component is only ever MOUNTED for the currently-visible video
 * (see `visibleVideoId === item.id` at the call site below) — everything else in the
 * list renders a plain placeholder <View>, not this component. That's deliberate:
 * `useVideoPlayer` must be given a stable, non-null source for the lifetime of the
 * component. Toggling its source between a real URI and `null` on a persisted hook
 * instance causes the native player to be released while a VideoView may still be
 * holding a reference to it, which throws "Cannot use shared object that was already
 * released". Mounting/unmounting the whole component instead lets expo-video's own
 * lifecycle cleanup release the player exactly once, safely.
 */
const VideoPreview = ({ uri, isScreenFocused }: { uri: string; isScreenFocused: boolean }) => {
  const [muted, setMuted] = useState(true);
  const isMountedRef = useRef(true);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = muted;
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      player.muted = muted;
      if (isScreenFocused) player.play();
      else player.pause();
    } catch (e) {}
  }, [isScreenFocused, muted, player]);

  useEffect(() => {
    return () => {
      try { player.pause(); } catch (e) {}
    };
  }, [player]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.videoBox, VIDEO_SIZE]}
      onPress={() => setMuted((m) => !m)}
    >
      <VideoView
        player={player}
        style={styles.mediaFill}
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.muteBadge}>
        <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
      </View>
    </TouchableOpacity>
=======

// ✅ VideoPreview sekarang menerima prop `isVisible` untuk pause/play otomatis
const VideoPreview = ({ uri, isVisible }: { uri: string; isVisible: boolean }) => {
  const player = useVideoPlayer(uri || null, (p) => {
    p.loop = true;
  });

  // ✅ Pause video ketika tidak terlihat di layar, play ketika terlihat
  useEffect(() => {
    try {
      if (isVisible) {
        player.play();
      } else {
        player.pause();
      }
    } catch (e) {}
  }, [isVisible]);

  return (
    <VideoView
      player={player}
      style={styles.videoBox}
      contentFit="cover"
      nativeControls={true}
    />
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  );
};

export default function FeedScreen() {
<<<<<<< HEAD
  const { posts, setPosts, currentUser, isDarkMode } = useStore();
  const navigation = useNavigation<any>();
  const isScreenFocused = useIsFocused(); // item 5: know when Home is off-screen
=======
  const { posts, setPosts, currentUser } = useStore();
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

<<<<<<< HEAD
  // Item 7: Following vs For You tabs
  const [feedTab, setFeedTab] = useState<'following' | 'forYou'>('forYou');

  // Live-synced list of who the current user follows. Fed by a Firestore
  // onSnapshot listener below — NOT a one-time fetch — so the Mengikuti tab
  // reacts immediately to a follow/unfollow that happens anywhere else in
  // the app (Search, Notifications, Comments -> Profile), regardless of
  // navigation focus timing.
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);

  // Subscribe to the current user's own doc in real time.
  useEffect(() => {
    if (!currentUser?.uid) {
      setFollowingIds([]);
      return;
    }
    const unsub = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (snap) => {
        const ids: string[] = snap.exists() ? (snap.data().following || []) : [];
        setFollowingIds(ids);
      },
      (err) => console.log('following snapshot error', err)
    );
    return () => unsub();
  }, [currentUser?.uid]);

  const fetchForYouPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data, 
        isLiked: data.likedBy?.includes(currentUser?.uid) || false 
      };
    }) as any[];
  };

  const fetchFollowingPosts = async (ids: string[]) => {
    if (!ids || ids.length === 0) return [];

    const q = query(collection(db, 'posts'), where('userId', 'in', ids.slice(0, 10)), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return { 
        id: d.id, 
        ...data, 
        isLiked: data.likedBy?.includes(currentUser?.uid) || false 
      };
    }) as any[];
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetched = feedTab === 'forYou' ? await fetchForYouPosts() : await fetchFollowingPosts(followingIds);
      setPosts(fetched);
=======
  // ✅ Track video mana yang sedang terlihat di layar
  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        isLiked: false,
      })) as any[];
      setPosts(fetchedPosts);
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = useCallback(async (postId: string, isLiked: boolean) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
<<<<<<< HEAD
        likesCount: increment(isLiked ? -1 : 1),
        // Simpan atau hapus UID user dari array likedBy di Firestore
        likedBy: isLiked ? arrayRemove(currentUser?.uid) : arrayUnion(currentUser?.uid)
      });
      
      // Update state lokal (Zustand)
=======
        likesCount: increment(isLiked ? -1 : 1)
      });
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      useStore.getState().updatePost(postId, {
        isLiked: !isLiked,
        likesCount: (posts.find(p => p.id === postId)?.likesCount || 0) + (isLiked ? -1 : 1)
      });
      if (!isLiked) {
        try {
          const postOwner = posts.find(p => p.id === postId)?.userId;
          if (postOwner && postOwner !== currentUser?.uid) {
            await addDoc(collection(db, 'notifications'), {
              toUserId: postOwner,
              fromUserId: currentUser?.uid,
              type: 'like',
              postId,
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
      console.log(error);
    }
  }, [posts, currentUser]);

  const openComments = useCallback(async (postId: string) => {
    setSelectedPostId(postId);
    setCommentModal(true);
    try {
      const q = query(
        collection(db, 'posts', postId, 'comments'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
  }, []);

<<<<<<< HEAD
  // NOTE: avatar/username taps on Home are intentionally NOT navigable.
  // Home must never open another user's Profile — the Profile screen only
  // opens another account when reached from Search, Notifications, or
  // Comments. See postHeader, videoIdentityBar, and the comment modal's
  // renderItem below: they use plain <View>s, not TouchableOpacity.

=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const commentData = {
        userId: currentUser?.uid,
        userDisplayName: currentUser?.displayName,
        text: commentText,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'posts', selectedPostId, 'comments'), commentData);
      await updateDoc(doc(db, 'posts', selectedPostId), { commentsCount: increment(1) });
      setComments(prev => [{ id: Date.now().toString(), ...commentData, createdAt: new Date() }, ...prev]);
      useStore.getState().updatePost(selectedPostId, {
        commentsCount: (posts.find(p => p.id === selectedPostId)?.commentsCount || 0) + 1
      });
      setCommentText('');
    } catch (e) {
      Alert.alert('Error', 'Gagal kirim komentar');
    } finally {
      setCommentLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

<<<<<<< HEAD
  // Refetch whenever the active tab changes OR the auth session resolves/changes.
  //
  // FIX: this effect used to depend only on [feedTab]. On cold start, Firebase
  // Auth resolves the current session asynchronously — this screen can mount
  // and call fetchPosts() BEFORE currentUser.uid is available. Since isLiked
  // is computed at fetch time from `data.likedBy?.includes(currentUser?.uid)`,
  // that first fetch would compute isLiked: false for every post (even ones
  // the user had already liked in a previous session), and because the effect
  // never re-ran after currentUser showed up, that wrong isLiked state stuck
  // around for the whole session — looking exactly like "like status reset
  // after logout/login". Adding currentUser?.uid here forces a refetch once
  // the real uid is known, so isLiked is computed correctly.
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedTab, currentUser?.uid]);

  // Refetch Mengikuti the instant the live following list changes — this is
  // what actually fixes "unfollowed account still stuck in Mengikuti":
  // it no longer depends on navigating back to Home, it reacts to the
  // Firestore write itself, live, from any screen.
  useEffect(() => {
    if (feedTab === 'following') {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followingIds]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const keyExtractor = useCallback((item: any) => item.id, []);

=======
  useEffect(() => { fetchPosts(); }, []);

  // ✅ Viewability config: video dianggap "terlihat" kalau 60% atau lebih ada di layar
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const keyExtractor = useCallback((item: any) => item.id, []);

  // ✅ Callback ketika item yang terlihat berubah
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    const visibleVideos = viewableItems.filter(
      (item: any) => item.item.mediaType === 'video' && item.item.mediaURL
    );
<<<<<<< HEAD
    setVisibleVideoId(visibleVideos.length > 0 ? visibleVideos[0].item.id : null);
  }, []);

  const renderPost = useCallback(({ item }: any) => {
    const overlayData = item.textOverlay
      ? { text: item.textOverlay, color: item.textColor || '#ffffff', xPct: item.textOverlayX ?? 50, yPct: item.textOverlayY ?? 80 }
      : null;
    const mediaSize = item.mediaType === 'video' ? VIDEO_SIZE : IMAGE_SIZE;

    return (
      <View style={styles.postCard}>
        {/* For photo/audio posts identity sits in a normal header above the media.
            Not tappable — Home never navigates to another user's Profile. */}
        {item.mediaType !== 'video' && (
          <View style={styles.postHeader}>
            <View style={styles.avatar}>
              {item.userPhotoURL ? (
                <Image source={{ uri: item.userPhotoURL }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{item.userDisplayName?.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={[styles.username, { color: '#fff' }]}>{item.userDisplayName}</Text>
          </View>
        )}

        <View style={{ width: mediaSize.width, height: mediaSize.height, alignSelf: 'center' }}>
          {item.mediaType === 'image' && item.mediaURL ? (
            <Image source={{ uri: item.mediaURL }} style={styles.mediaFill} />
          ) : item.mediaType === 'audio' && item.mediaURL ? (
            <AudioPlayer uri={item.mediaURL} caption={item.caption} />
          ) : item.mediaType === 'video' && item.mediaURL ? (
            visibleVideoId === item.id ? (
              <VideoPreview key={item.mediaURL} uri={item.mediaURL} isScreenFocused={isScreenFocused} />
            ) : (
              <View style={[styles.videoBox, VIDEO_SIZE]} />
            )
          ) : (
            <View style={styles.noMediaBox}>
              <Text style={styles.noMediaText}>📝 Post</Text>
            </View>
          )}

          {/* Item 8: overlay text rendered at the exact spot it was saved */}
          {(item.mediaType === 'image' || item.mediaType === 'video') && overlayData && (
            <TextOverlay data={overlayData} containerWidth={mediaSize.width} containerHeight={mediaSize.height} />
          )}

          {/* Item 7: for video posts, identity is overlaid at the bottom, Reels-style,
              so it stays legible against any background. Not tappable — see note above. */}
          {item.mediaType === 'video' && (
            <View style={styles.videoIdentityBar}>
              <View style={styles.avatarSmall}>
                {item.userPhotoURL ? (
                  <Image source={{ uri: item.userPhotoURL }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>{item.userDisplayName?.charAt(0).toUpperCase()}</Text>
                )}
              </View>
              <Text style={styles.videoUsername} numberOfLines={1}>{item.userDisplayName}</Text>
            </View>
          )}
        </View>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id, item.isLiked)}>
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isLiked ? '#E91E63' : '#fff'}
            />
            <Text style={styles.actionCount}>{item.likesCount || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => openComments(item.id)}>
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Text style={styles.actionCount}>{item.commentsCount || 0}</Text>
          </TouchableOpacity>
        </View>

        {item.caption && item.mediaType !== 'audio' ? (
          <Text style={styles.caption}>
            <Text style={styles.captionName}>{item.userDisplayName} </Text>
            {item.caption}
          </Text>
        ) : null}
      </View>
    );
  }, [visibleVideoId, isScreenFocused, handleLike, openComments]);
=======
    if (visibleVideos.length > 0) {
      setVisibleVideoId(visibleVideos[0].item.id);
    } else {
      setVisibleVideoId(null);
    }
  }, []);

  const renderPost = useCallback(({ item }: any) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userDisplayName?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{item.userDisplayName}</Text>
      </View>

      {item.mediaType === 'image' && item.mediaURL ? (
        <Image source={{ uri: item.mediaURL }} style={styles.postImage} />
      ) : item.mediaType === 'audio' && item.mediaURL ? (
        <AudioPlayer uri={item.mediaURL} caption={item.caption} />
      ) : item.mediaType === 'video' && item.mediaURL ? (
        // ✅ Kirim isVisible berdasarkan apakah ID ini yang sedang terlihat
        <VideoPreview
          uri={item.mediaURL}
          isVisible={visibleVideoId === item.id}
        />
      ) : (
        <View style={styles.noMediaBox}>
          <Text style={styles.noMediaText}>📝 Post</Text>
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleLike(item.id, item.isLiked)}
        >
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.isLiked ? '#E91E63' : '#fff'}
          />
          <Text style={styles.actionCount}>{item.likesCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openComments(item.id)}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#fff" />
          <Text style={styles.actionCount}>{item.commentsCount || 0}</Text>
        </TouchableOpacity>
      </View>

      {item.caption && item.mediaType !== 'audio' ? (
        <Text style={styles.caption}>
          <Text style={styles.captionName}>{item.userDisplayName} </Text>
          {item.caption}
        </Text>
      ) : null}
    </View>
  ), [visibleVideoId, handleLike, openComments]);

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 MediaNova</Text>
<<<<<<< HEAD
        
        {/* Tambahkan tombol notifikasi di sini bang */}
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Item 7: Following / For You tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, feedTab === 'following' && styles.tabBtnActive]}
          onPress={() => setFeedTab('following')}
        >
          <Text style={[styles.tabText, feedTab === 'following' && styles.tabTextActive]}>Mengikuti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, feedTab === 'forYou' && styles.tabBtnActive]}
          onPress={() => setFeedTab('forYou')}
        >
          <Text style={[styles.tabText, feedTab === 'forYou' && styles.tabTextActive]}>Untuk Anda</Text>
        </TouchableOpacity>
      </View>

      {loading && posts.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color="#E91E63" size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderPost}
          // NOTE: removeClippedSubviews is intentionally OFF. On Android it detaches/
          // recycles native views for off-screen rows outside of React's own lifecycle.
          // When one of those rows contains a live VideoView, the native video surface
          // can get destroyed or reused for a different row while React still thinks a
          // player is attached to it — which is what throws "Cannot use shared object
          // that was already released". Since only one video is ever mounted at a time
          // now (see VideoPreview above), we don't need clipped-subviews memory savings
          // badly enough to risk that crash.
          windowSize={3}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E91E63" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {feedTab === 'following'
                  ? 'Belum ada postingan dari yang kamu ikuti. Follow seseorang dulu! 👀'
                  : 'Belum ada post. Jadilah yang pertama! 🎬'}
              </Text>
            </View>
          }
        />
      )}
=======
      </View>

      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderPost}
        removeClippedSubviews={true}
        windowSize={3}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        // ✅ Pasang viewability handler di sini
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E91E63" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada post. Jadilah yang pertama! 🎬</Text>
          </View>
        }
      />
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

      <Modal
        visible={commentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Komentar</Text>
              <TouchableOpacity onPress={() => setCommentModal(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              style={styles.commentList}
              renderItem={({ item }) => (
<<<<<<< HEAD
                // Not tappable — Home (including this modal) never navigates
                // to another user's Profile.
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {item.userDisplayName?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentName}>{item.userDisplayName}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                </View>
              )}
<<<<<<< HEAD
              ListEmptyComponent={<Text style={styles.noComments}>Belum ada komentar</Text>}
=======
              ListEmptyComponent={
                <Text style={styles.noComments}>Belum ada komentar</Text>
              }
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
            />
            <View style={styles.commentInputBox}>
              <TextInput
                style={styles.commentInput}
                placeholder="Tulis komentar..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
<<<<<<< HEAD
              <TouchableOpacity style={styles.sendBtn} onPress={handleComment} disabled={commentLoading}>
=======
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleComment}
                disabled={commentLoading}
              >
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
                {commentLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Ionicons name="send" size={20} color="#fff" />
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
<<<<<<< HEAD
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    paddingBottom: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222' 
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222' },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#E91E63' },
  tabText: { color: '#888', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  postCard: { marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 10, overflow: 'hidden' },
  avatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 8, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  username: { color: '#fff', fontWeight: 'bold' },
  mediaFill: { width: '100%', height: '100%' },
  videoBox: { backgroundColor: '#111', position: 'relative' },
  muteBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, padding: 6 },
  videoIdentityBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 12, paddingVertical: 10,
  },
  videoUsername: { color: '#fff', fontWeight: 'bold', fontSize: 14, flex: 1 },
=======
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  postCard: { marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  username: { color: '#fff', fontWeight: 'bold' },
  postImage: { width: '100%', height: 300, resizeMode: 'cover' },
  videoBox: { width: '100%', height: 300, backgroundColor: '#111' },
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  noMediaBox: { width: '100%', height: 80, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  noMediaText: { color: '#888', fontSize: 18 },
  postActions: { flexDirection: 'row', padding: 12, gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { color: '#fff', fontSize: 14 },
  caption: { color: '#aaa', paddingHorizontal: 12, paddingBottom: 12, fontSize: 14 },
  captionName: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', padding: 40 },
  emptyText: { color: '#888', textAlign: 'center', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  commentList: { maxHeight: 300 },
  commentItem: { flexDirection: 'row', padding: 12, gap: 10 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center' },
  commentAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  commentContent: { flex: 1 },
  commentName: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  commentText: { color: '#aaa', fontSize: 14 },
  noComments: { color: '#888', textAlign: 'center', padding: 20 },
  commentInputBox: { flexDirection: 'row', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: '#222' },
  commentInput: { flex: 1, backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: '#fff' },
  sendBtn: { backgroundColor: '#E91E63', borderRadius: 20, width: 40, justifyContent: 'center', alignItems: 'center' },
});