export const selectLoginToken = (reduxState)=> reduxState.auth.token
export const selectUser = (reduxState)=> reduxState.auth.me
export const selectloading = (reduxState)=> reduxState.auth.loading

