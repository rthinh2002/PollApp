import {db} from '../firebase';
import Question from '../model/Question';
import User from '../model/User';
import {ref, get, update, push} from 'firebase/database';

export default class QuestionService {
  constructor() {
    this.questionRef = ref(db, "questions");
  }

  async fetchQuestions() {
      try {
          const snapshot = await get(this.questionRef);
          const questionData = snapshot.val();
          const questions = [];
          
          for (const key in questionData) {
            const question = new Question(
              questionData[key].author,
              key, // Assuming "key" holds the question ID
              questionData[key].isDone,
              questionData[key].optionOne,
              questionData[key].optionTwo,
              questionData[key].timestamp,
            );
            questions.push(question);
          }
          return questions; 
        } catch (error) {
          console.error(error);
      }
  }

  async getQuestionById(questionId) {
    try {
      const snapshot = await get(ref(db, `questions/${questionId}`));
      const questionData = snapshot.val();
      const question = new Question(
        questionData.author, 
        questionId,
        questionData.isDone,
        questionData.optionOne,
        questionData.optionTwo,
        questionData.timestamp,
      );
      return question;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserByUserName(username) {
    try {
      const snapshot = await get(ref(db, `users/`));
      const userData = snapshot.val();
      const filteredUser = (Object.values(userData).filter((user) => user.username === username))[0];
      const user = new User(
        filteredUser.name,
        filteredUser.username,
        filteredUser.answer
      );
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async changeQuestionStatus(questionId, status){
    try {
      await update(ref(db, `questions/${questionId}`), {
        isDone: status,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async vote(questionId, option, username) {
    try {
      const optionRef = ref(db, `questions/${questionId}/${option}`);
      const updatedVotes = await get(optionRef)
        .then((snapshot) => {
          const existingVotes = snapshot.val().votes || [];
          existingVotes.push(username);
          return existingVotes;
        });
      await update(optionRef, { votes: updatedVotes });

      // Delete user from other option
      const otherOption = option === 'optionOne' ? 'optionTwo' : 'optionOne';
      const otherOptionRef = ref(db, `questions/${questionId}/${otherOption}`);
      const otherOptionUpdatedVotes = await get(otherOptionRef)
        .then((snapshot) => {
          const existingVotes = snapshot.val().votes || [];
          const updatedVotes = existingVotes.filter((vote) => vote !== username);
          return updatedVotes;
        });
      await update(otherOptionRef, { votes: otherOptionUpdatedVotes });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async addNewQuestion(question) {
    try {
      const questionRef = ref(db, 'questions');

      push(questionRef, question)
       .then(() => {
        return true;
       })
       .catch((error) => {
        console.error(error);
        return false;
       })

    } catch (error) {
      console.error(error);
      return false;
    }

  }
}; 