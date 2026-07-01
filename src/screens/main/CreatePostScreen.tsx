import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Image, Modal,
<<<<<<< HEAD
  KeyboardAvoidingView, Platform, Dimensions
=======
  ViewStyle
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utils/firebase';
import { useStore } from '../../store/useStore';
import { uploadToCloudinary } from '../../utils/cloudinary';
<<<<<<< HEAD
import TextOverlay, { TextOverlayData } from '../../components/TextOverlay';

const TEXT_COLORS = ['#ffffff', '#000000', '#E91E63', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff8800'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Item 9: standardize media preview to the app's target ratios so what you see
// is what gets published. Photos are 1:1, videos are 9:16.
const IMAGE_BOX = { width: SCREEN_WIDTH - 24, height: SCREEN_WIDTH - 24 };
const VIDEO_BOX = { width: SCREEN_WIDTH - 24, height: (SCREEN_WIDTH - 24) * (16 / 9) };

/**
 * IMPORTANT: only ever mounted when `mediaType === 'video' && mediaUri` is true (see
 * call site below) and always given a stable, non-null `uri`. Never swap this hook's
 * source between a real URI and `null` on a persisted component instance — that
 * releases the native player while a VideoView may still hold a reference to it and
 * throws "Cannot use shared object that was already released". Mounting/unmounting
 * this whole component instead (which React does naturally when mediaUri/mediaType
 * change) lets expo-video release the player exactly once, safely.
 */
function VideoEditorPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.pause();
  });

  useEffect(() => {
    return () => {
      try { player.pause(); } catch (e) {}
    };
  }, [player]);

  return (
    <VideoView
      player={player}
      style={styles.mediaFill}
      contentFit="contain"
      nativeControls={true}
    />
  );
}
=======

const TEXT_COLORS = ['#ffffff', '#000000', '#E91E63', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff8800'];
const TEXT_POSITIONS = ['top', 'center', 'bottom'];
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

export default function CreatePostScreen({ navigation, route }: any) {
  const { currentUser, addPost } = useStore();
  const [caption, setCaption] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

<<<<<<< HEAD
  // Text overlay state (item 8): position stored as % so it can be dragged
  // freely and reproduced exactly in the feed after publish.
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [savedOverlay, setSavedOverlay] = useState<TextOverlayData | null>(null);
=======
  // Text overlay state
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState('bottom');
  const [savedOverlayText, setSavedOverlayText] = useState('');

  // Video player untuk preview
  const player = useVideoPlayer(
    mediaType === 'video' && mediaUri ? mediaUri : null,
    (p) => { p.loop = true; p.pause(); }
  );
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06

  useEffect(() => {
    if (route?.params?.imageUri) {
      setMediaUri(route.params.imageUri);
      setMediaType('image');
    } else if (route?.params?.videoUri) {
      setMediaUri(route.params.videoUri);
      setMediaType('video');
    } else if (route?.params?.audioUri) {
      setMediaUri(route.params.audioUri);
      setMediaType('audio');
    }
  }, [route?.params]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
<<<<<<< HEAD
      aspect: [1, 1],
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      quality: 0.8,
    });
    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('image');
<<<<<<< HEAD
      setSavedOverlay(null);
=======
      setSavedOverlayText('');
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 60,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('video');
<<<<<<< HEAD
      setSavedOverlay(null);
=======
      setSavedOverlayText('');
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
    }
  };

  const handlePost = async () => {
    if (!caption && !mediaUri) {
      Alert.alert('Error', 'Tambahkan caption atau media dulu!');
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    try {
      let mediaURL = '';
      if (mediaUri) {
        mediaURL = await uploadToCloudinary(mediaUri, mediaType, (progress) => {
          setUploadProgress(progress);
        });
      }

      const postData: any = {
        userId: currentUser?.uid,
        userDisplayName: currentUser?.displayName,
        userPhotoURL: currentUser?.photoURL || '',
        mediaURL,
        mediaType,
        caption,
<<<<<<< HEAD
        // item 8: overlay persisted with exact position so it renders
        // identically in the feed after publishing.
        textOverlay: savedOverlay?.text || '',
        textColor: savedOverlay?.color || '#ffffff',
        textOverlayX: savedOverlay?.xPct ?? 50,
        textOverlayY: savedOverlay?.yPct ?? 80,
=======
        textOverlay: savedOverlayText || '',
        textColor,
        textPosition,
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);
      addPost({
        id: docRef.id,
        userId: currentUser?.uid || '',
        userDisplayName: currentUser?.displayName || '',
        userPhotoURL: currentUser?.photoURL || '',
        mediaURL,
        mediaType,
        caption,
<<<<<<< HEAD
        textOverlay: savedOverlay?.text || '',
        textColor: savedOverlay?.color || '#ffffff',
        textOverlayX: savedOverlay?.xPct ?? 50,
        textOverlayY: savedOverlay?.yPct ?? 80,
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: new Date(),
<<<<<<< HEAD
      } as any);

      setCaption('');
      setMediaUri(null);
      setSavedOverlay(null);
=======
      });

      setCaption('');
      setMediaUri(null);
      setSavedOverlayText('');
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
      setUploadProgress(0);
      Alert.alert('Berhasil! 🎉', 'Post berhasil dibuat!');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const previewBox = mediaType === 'video' ? VIDEO_BOX : IMAGE_BOX;

  return (
    // Item 2: KeyboardAvoidingView wraps the whole screen so the caption
    // input rises above the keyboard instead of being covered by it.
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buat Post</Text>
        </View>

        {/* Media buttons */}
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={26} color="#fff" />
            <Text style={styles.mediaBtnText}>Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaBtn} onPress={pickVideo}>
            <Ionicons name="videocam-outline" size={26} color="#fff" />
            <Text style={styles.mediaBtnText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => navigation.navigate('VideoRecord')}
          >
            <Ionicons name="radio-button-on-outline" size={26} color="#E91E63" />
            <Text style={styles.mediaBtnText}>Rekam</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => navigation.navigate('AudioRecord')}
          >
            <Ionicons name="mic-outline" size={26} color="#fff" />
            <Text style={styles.mediaBtnText}>Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={() => navigation.navigate('CameraFilter')}
          >
            <Ionicons name="color-filter-outline" size={26} color="#fff" />
            <Text style={styles.mediaBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Preview media */}
        {mediaUri && (
          <View style={styles.previewBox}>
            {mediaType === 'image' && (
              <View style={[styles.mediaWrapper, previewBox]}>
                <Image source={{ uri: mediaUri }} style={styles.mediaFill} resizeMode="cover" />
                <TextOverlay
                  data={savedOverlay}
                  editable
                  containerWidth={previewBox.width}
                  containerHeight={previewBox.height}
                  onChangePosition={(xPct, yPct) =>
                    setSavedOverlay((prev) => (prev ? { ...prev, xPct, yPct } : prev))
                  }
                />
              </View>
            )}

            {mediaType === 'video' && (
              // Item 9: fixed 9:16 box with `contain` so nothing is cropped,
              // matching how it will actually appear once published.
              <View style={[styles.mediaWrapper, previewBox]}>
                <VideoEditorPreview key={mediaUri} uri={mediaUri} />
                <TextOverlay
                  data={savedOverlay}
                  editable
                  containerWidth={previewBox.width}
                  containerHeight={previewBox.height}
                  onChangePosition={(xPct, yPct) =>
                    setSavedOverlay((prev) => (prev ? { ...prev, xPct, yPct } : prev))
                  }
                />
              </View>
            )}

            {mediaType === 'audio' && (
              <View style={styles.audioPreview}>
                <Ionicons name="musical-notes" size={48} color="#E91E63" />
                <Text style={styles.audioPreviewText}>Audio dipilih ✅</Text>
              </View>
            )}

            <View style={styles.previewActions}>
              {(mediaType === 'image' || mediaType === 'video') && (
                <TouchableOpacity
                  style={styles.overlayBtn}
                  onPress={() => {
                    setOverlayText(savedOverlay?.text || '');
                    setTextColor(savedOverlay?.color || '#ffffff');
                    setShowTextOverlay(true);
                  }}
                >
                  <Ionicons name="text-outline" size={18} color="#fff" />
                  <Text style={styles.overlayBtnText}>Teks Overlay</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => { setMediaUri(null); setSavedOverlay(null); }}
              >
                <Ionicons name="close-circle" size={18} color="#E91E63" />
                <Text style={styles.removeBtnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption */}
        <View style={styles.captionBox}>
          <TextInput
            style={styles.captionInput}
            placeholder="Tulis caption..."
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>{caption.length}/500</Text>
        </View>

        {loading && (
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>Mengupload... {uploadProgress}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.postBtn} onPress={handlePost} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.postBtnText}>Post Sekarang 🚀</Text>
          }
        </TouchableOpacity>

        {/* Text Overlay Modal */}
        <Modal
          visible={showTextOverlay}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowTextOverlay(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tambah Teks Overlay</Text>
                <TouchableOpacity onPress={() => setShowTextOverlay(false)}>
                  <Ionicons name="close" size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.overlayInput}
                placeholder="Tulis teks overlay..."
                placeholderTextColor="#888"
                value={overlayText}
                onChangeText={setOverlayText}
                multiline
                maxLength={100}
              />

              <Text style={styles.modalLabel}>Warna Teks:</Text>
              <View style={styles.colorRow}>
                {TEXT_COLORS.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: color },
                      textColor === color && styles.colorBtnActive
                    ]}
                    onPress={() => setTextColor(color)}
                  />
                ))}
              </View>

              <Text style={styles.modalHint}>
                Setelah disimpan, seret teksnya langsung di atas preview untuk mengatur posisi. 🖐️
              </Text>

              <TouchableOpacity
                style={styles.saveOverlayBtn}
                onPress={() => {
                  if (!overlayText.trim()) {
                    setSavedOverlay(null);
                  } else {
                    setSavedOverlay((prev) => ({
                      text: overlayText,
                      color: textColor,
                      xPct: prev?.xPct ?? 10,
                      yPct: prev?.yPct ?? 75,
                    }));
                  }
                  setShowTextOverlay(false);
                }}
              >
                <Text style={styles.saveOverlayBtnText}>Simpan Teks ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
=======
  const getTextPositionStyle = () => {
  const positions: Record<string, ViewStyle> = {
    top: { top: 30 },
    middle: { top: '50%', transform: [{ translateY: -12 }] },
    bottom: { bottom: 30 }
  };
  return positions[textPosition] || positions.bottom;
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buat Post</Text>
      </View>

      {/* Media buttons */}
      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={26} color="#fff" />
          <Text style={styles.mediaBtnText}>Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaBtn} onPress={pickVideo}>
          <Ionicons name="videocam-outline" size={26} color="#fff" />
          <Text style={styles.mediaBtnText}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaBtn}
          onPress={() => navigation.navigate('VideoRecord')}
        >
          <Ionicons name="radio-button-on-outline" size={26} color="#E91E63" />
          <Text style={styles.mediaBtnText}>Rekam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaBtn}
          onPress={() => navigation.navigate('AudioRecord')}
        >
          <Ionicons name="mic-outline" size={26} color="#fff" />
          <Text style={styles.mediaBtnText}>Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaBtn}
          onPress={() => navigation.navigate('CameraFilter')}
        >
          <Ionicons name="color-filter-outline" size={26} color="#fff" />
          <Text style={styles.mediaBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Preview media */}
      {mediaUri && (
        <View style={styles.previewBox}>
          {/* IMAGE preview */}
          {mediaType === 'image' && (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: mediaUri }} style={styles.previewImage} />
              {savedOverlayText ? (
                <Text style={[
                  styles.overlayTextPreview,
                  { color: textColor },
                  getTextPositionStyle()
                ]}>
                  {savedOverlayText}
                </Text>
              ) : null}
            </View>
          )}

          {/* VIDEO preview */}
          {mediaType === 'video' && (
            <View style={styles.videoWrapper}>
              <VideoView
                player={player}
                style={styles.videoPreview}
                contentFit="contain"
                nativeControls={true}
              />
              {savedOverlayText ? (
                <Text style={[
                  styles.overlayTextPreview,
                  { color: textColor },
                  getTextPositionStyle()
                ]}>
                  {savedOverlayText}
                </Text>
              ) : null}
            </View>
          )}

          {/* AUDIO preview */}
          {mediaType === 'audio' && (
            <View style={styles.audioPreview}>
              <Ionicons name="musical-notes" size={48} color="#E91E63" />
              <Text style={styles.audioPreviewText}>Audio dipilih ✅</Text>
            </View>
          )}

          {/* Action buttons di atas preview */}
          <View style={styles.previewActions}>
            {(mediaType === 'image' || mediaType === 'video') && (
              <TouchableOpacity
                style={styles.overlayBtn}
                onPress={() => {
                  setOverlayText(savedOverlayText);
                  setShowTextOverlay(true);
                }}
              >
                <Ionicons name="text-outline" size={18} color="#fff" />
                <Text style={styles.overlayBtnText}>Teks Overlay</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => { setMediaUri(null); setSavedOverlayText(''); }}
            >
              <Ionicons name="close-circle" size={18} color="#E91E63" />
              <Text style={styles.removeBtnText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Caption */}
      <View style={styles.captionBox}>
        <TextInput
          style={styles.captionInput}
          placeholder="Tulis caption..."
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>
      </View>

      {/* Upload progress */}
      {loading && (
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>Mengupload... {uploadProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
          </View>
        </View>
      )}

      {/* Post button */}
      <TouchableOpacity
        style={styles.postBtn}
        onPress={handlePost}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.postBtnText}>Post Sekarang 🚀</Text>
        }
      </TouchableOpacity>

      {/* Text Overlay Modal */}
      <Modal
        visible={showTextOverlay}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTextOverlay(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Teks Overlay</Text>
              <TouchableOpacity onPress={() => setShowTextOverlay(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.overlayInput}
              placeholder="Tulis teks overlay..."
              placeholderTextColor="#888"
              value={overlayText}
              onChangeText={setOverlayText}
              multiline
              maxLength={100}
            />

            <Text style={styles.modalLabel}>Warna Teks:</Text>
            <View style={styles.colorRow}>
              {TEXT_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color },
                    textColor === color && styles.colorBtnActive
                  ]}
                  onPress={() => setTextColor(color)}
                />
              ))}
            </View>

            <Text style={styles.modalLabel}>Posisi Teks:</Text>
            <View style={styles.positionRow}>
              {TEXT_POSITIONS.map(pos => (
                <TouchableOpacity
                  key={pos}
                  style={[styles.posBtn, textPosition === pos && styles.posBtnActive]}
                  onPress={() => setTextPosition(pos)}
                >
                  <Text style={[styles.posBtnText, textPosition === pos && styles.posBtnTextActive]}>
                    {pos === 'top' ? '⬆️ Atas' : pos === 'center' ? '⬛ Tengah' : '⬇️ Bawah'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveOverlayBtn}
              onPress={() => {
                setSavedOverlayText(overlayText);
                setShowTextOverlay(false);
              }}
            >
              <Text style={styles.saveOverlayBtnText}>Simpan Teks ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  flex: { flex: 1, backgroundColor: '#000' },
=======
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  mediaButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, flexWrap: 'wrap', gap: 8 },
  mediaBtn: { alignItems: 'center', backgroundColor: '#111', padding: 12, borderRadius: 12, width: 62, borderWidth: 1, borderColor: '#333' },
  mediaBtnText: { color: '#fff', fontSize: 10, marginTop: 4 },
  previewBox: { margin: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#111' },
<<<<<<< HEAD
  mediaWrapper: { position: 'relative', alignSelf: 'center', backgroundColor: '#000', overflow: 'hidden' },
  mediaFill: { width: '100%', height: '100%' },
  audioPreview: { height: 150, justifyContent: 'center', alignItems: 'center', gap: 12 },
  audioPreviewText: { color: '#fff', fontSize: 16 },
=======
  imageWrapper: { position: 'relative' },
  previewImage: { width: '100%', height: 300, resizeMode: 'cover' },
  videoWrapper: { position: 'relative', height: 300 },
  videoPreview: { width: '100%', height: 300 },
  audioPreview: { height: 150, justifyContent: 'center', alignItems: 'center', gap: 12 },
  audioPreviewText: { color: '#fff', fontSize: 16 },
  overlayTextPreview: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 4,
    paddingHorizontal: 16,
  },
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  previewActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'rgba(0,0,0,0.7)' },
  overlayBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  overlayBtnText: { color: '#fff', fontSize: 13 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  removeBtnText: { color: '#E91E63', fontSize: 13 },
  captionBox: { margin: 12 },
  captionInput: { backgroundColor: '#111', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#333' },
  charCount: { color: '#888', textAlign: 'right', marginTop: 4, fontSize: 12 },
  progressBox: { marginHorizontal: 12, marginBottom: 8 },
  progressText: { color: '#fff', marginBottom: 6, textAlign: 'center' },
  progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#E91E63', borderRadius: 3 },
<<<<<<< HEAD
  postBtn: { margin: 12, backgroundColor: '#E91E63', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  postBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
=======
  postBtn: { margin: 12, backgroundColor: '#E91E63', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 40 },
  postBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // Modal styles
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  overlayInput: { backgroundColor: '#222', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  modalLabel: { color: '#888', fontSize: 13, marginBottom: 10, textTransform: 'uppercase' },
<<<<<<< HEAD
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  colorBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#333' },
  colorBtnActive: { borderColor: '#E91E63', transform: [{ scale: 1.2 }] },
  modalHint: { color: '#666', fontSize: 12, marginBottom: 16, fontStyle: 'italic' },
=======
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#333' },
  colorBtnActive: { borderColor: '#E91E63', transform: [{ scale: 1.2 }] },
  positionRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  posBtn: { flex: 1, padding: 10, backgroundColor: '#222', borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  posBtnActive: { borderColor: '#E91E63', backgroundColor: '#1a0010' },
  posBtnText: { color: '#888', fontSize: 12 },
  posBtnTextActive: { color: '#E91E63', fontWeight: 'bold' },
>>>>>>> 24e033e790ca381bbf6dc1d4a598f48701fb4c06
  saveOverlayBtn: { backgroundColor: '#E91E63', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveOverlayBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});