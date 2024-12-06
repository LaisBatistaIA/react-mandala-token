import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";

class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem("authUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("authUser");
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (user) => {
    console.log(user);
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(async (userCredential) => {
          try {
            // const userAuth = userCredential.user;
            await userCredential.user.sendEmailVerification();

            const userData = await this.addNewUserToFirestore(user); // Salva no Firestore
            resolve(userData); // Resolve com os dados do usuário
          } catch (error) {
            reject("Erro ao salvar dados no Firestore: " + error);
          }
        })
        .catch((error) => {
          reject(this._handleError(error)); // Trata erro de registro
        });
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = (user) => {
    return new Promise((resolve, reject) => {
      this.updateUserFirestore(user)
      .then((result)=> {
        resolve(result)
      })
      .catch((error) => {
        reject(this._handleError(error));
      });
    });
  };

  changePassword = (userPasswords) => {
    return new Promise((resolve, reject) => {
      if (userPasswords.currentPassword && userPasswords.newPassword) {
        this.reauthentication(userPasswords.currentPassword)
          .then(() => this.changePassword(userPasswords.newPassword))
            .then(() => {
              resolve("Succesful Change Password");
            })
          .catch((error) => {
            reject(this._handleError(error));
          });
      }
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          () => {
            resolve(firebase.auth().currentUser);
          },
          (error) => {
            reject(this._handleError(error));
          },
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */

  socialLoginUser = async (type) => {
    let provider;
    if (type === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (type === "facebook") {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  };

  addNewUserToFirestore = (user) => {
    const collection = firebase.firestore().collection("users");
    const details = {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      phone: user.phone,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.doc(firebase.auth().currentUser.uid).set(details);
    return { user, details };
  };

  setLoggeedInUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  /**
   * Returns if user have email verified
   */
  userVerifiedEmail = () => {
    return firebase.auth().currentUser.emailVerified;
  };

  getUserData = (userId) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            resolve(doc.data());
          } else {
            reject(new Error("Documento não encontrado."));
          }
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  updateUserFirestore(user) {
    const userRef = firebase.firestore().collection("users").doc(user.uid); // Referência ao documento do usuário

    const updatedData = {};

    // Atualiza apenas os campos que foram fornecidos
    if (user.name) updatedData.name = user.name;
    if (user.lastName) updatedData.lastName = user.lastName;
    if (user.phone) updatedData.phone = user.phone;

    // Se algum dado foi alterado, atualiza no Firestore
    return userRef
      .update(updatedData)
      .then(() => {
        console.log("Dados do usuário atualizados com sucesso no Firestore.");
        return "Update User Data";
      })
      .catch((error) => {
        console.error(
          "Erro ao atualizar os dados do Firestore:",
          error.message,
        );
        throw error; // Lança o erro para ser tratado em outro ponto
      });
  }

  reauthentication = (password) => {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password,
    );

    return user
      .reauthenticateWithCredential(credential)
      .then(() => {
        console.log("Reautenticação bem-sucedida.");
      })
      .catch((error) => {
        console.error("Erro de reautenticação:", error.message);
        throw error;
      });
  };

  changePassword = (newPassword) => {
    firebase
      .auth()
      .currentUser.updatePassword(newPassword)
      .then(() => {
        console.log("Senha alterada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao alterar a senha:", error.message);
        throw error;
      });
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { getFirebaseBackend, initFirebaseBackend };
