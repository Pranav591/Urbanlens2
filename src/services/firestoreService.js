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
    console.log('Add Issue Error:', error);
    throw error;
  }
};

export const getIssues = async () => {
  try {
    const snapshot = await firestore()
      .collection('issues')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log('Get Issues Error:', error);
    return [];
  }
};