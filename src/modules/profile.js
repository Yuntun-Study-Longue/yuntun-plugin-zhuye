export const SET_CURRENT_PROFILE = "auth/SET_CURRENT_PROFILE";

const initialState = {
  currentProfile: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: action.profile
      };

    default:
      return state;
  }
};

export const getCurrentProfile = id => dispatch =>
  new Promise(resolve => {
    setTimeout(() => {
      let profile;

      if (id === 1) {
        profile = {
          id,
          name: "Alichs",
          image: ''
        };
      } else {
        profile = {
          id,
          name: "Tsher",
          image: ''
        };
      }

      dispatch({
        type: SET_CURRENT_PROFILE,
        profile
      });

      resolve(profile);
    }, 1000);
  });

export const removeCurrentProfile = () => dispatch =>
  new Promise(resolve => {
    dispatch({
      type: SET_CURRENT_PROFILE,
      profile: {}
    });

    resolve({});
  });
