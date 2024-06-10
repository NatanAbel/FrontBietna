export const selectLoginToken = (reduxState)=> reduxState.auth.token
export const selectUser = (reduxState)=> reduxState.auth.me
export const selectloading = (reduxState)=> reduxState.auth.loading
export const selectIsAuthenticated = (reduxState)=> reduxState.auth.isAuthenticated
export const selectStatus = (reduxState)=> reduxState.auth.status

export const selectFavs = (reduxState)=>{
    const token = reduxState.auth.token
    //  mapping over favorites array which is array of id's and find till it matches to house id
    const houses = reduxState.house.houses
    if(token){
        const favorites = reduxState.auth.me
        console.log("favorites...",favorites.favorites)
    const matchFavs = favorites.favorites.map(favId => 
        houses.find(house => house._id === favId)
        )
        // console.log("favorites......", favorites)

    return matchFavs
    }
}

