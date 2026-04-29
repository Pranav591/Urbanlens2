import firestore from '@react-native-firebase/firestore';

export const addIssue = async (issue) => {
  try {
    const docRef = await firestore()
      .collection('issues')
      .add({
        ...issue,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    return docRef.id;
  } catch (error) {
    console.log('Firestore Error:', error);
    throw error;
  }
};