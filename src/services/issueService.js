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
    console.error("Firestore write FAILED:", error);
    throw error;
  }
};

export const getIssues = async () => {
  try {
    const snapshot = await firestore()
      .collection('issues')
      .orderBy('createdAt', 'desc')
      .get();

    const issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return issues;
  } catch (error) {
    console.error("ERROR FETCHING ISSUES:", error);
    throw error;
  }
};