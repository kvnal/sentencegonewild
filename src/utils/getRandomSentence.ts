import sentences from '../assets/sentences.json';
import { SentenceDataCollection, SentenceEntry } from '../../game/shared.js';



export const getRandomSentence = (): SentenceEntry => {
  try {
    // Load the JSON file asynchronously
    const data: SentenceDataCollection = sentences;

    // Get the length of the array
    const length = data.all.length;

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * length);

    // Return the random entry (id and sentence)
    return {
      id: data.all[randomIndex].id,
      sentence: data.all[randomIndex].sentence,
    };
  } catch (error) {
    console.error('Error reading the file:', error);
    throw new Error('Unable to retrieve sentence');
  }
}